const express = require('express');
const router = express.Router();
const db = require('../db/db');
const sql = require('../sql.js');
const path = require('path');
const bcrypt = require('bcrypt');



// 회원가입
router.post('/join_process', function (request, response) {
    const user = request.body;
    const encryptedPW = bcrypt.hashSync(user.user_pw, 10); // 비밀번호 암호화
    db.query(sql.join, [ user.user_id, user.user_name, user.user_email, encryptedPW, user.user_pns], function (error, data) {
        if (error) {
            return response.status(500).json({
                message: 'DB_error'
            })
        }
        return response.status(200).json({
            message: 'join_complete'
        });
    })
})

// 로그인
router.post('/login_process', function (request, response) {
    const loginUser = request.body;

    // db에서 아이디가 있는지 확인
    db.query(sql.id_check, [loginUser.user_id], function (error, results, fields) {
        if (results.length <= 0) {
            return response.status(200).json({
                message: 'undefined_id'
            })
        } else {
            db.query(sql.login, [loginUser.user_id], function (error, results, fields) {
                const same = bcrypt.compareSync(loginUser.user_pw, results[0].password);
                if (same) {
                    // ID에 저장된 pw 값과 입력한 pw값이 동일한 경우
                    db.query(sql.get_user_no, [loginUser.user_id], function (error, results, fields) {
                        return response.status(200).json({
                            message: results[0].user_no
                        })
                    })
                } else {
                    // 비밀번호 불일치
                    return response.status(200).json({
                        message: 'incorrect_pw'
                    })
                }
            })
        }
    })
})
// 카카오 로그인
router.post('/kakaoLoginProcess', function (request, response) {
    const kakao = request.body;

    // 데이터 없을 시 회원가입도 진행
    db.query(sql.kakao_check, [kakao.user_id], function (error, results, fields) {
        if (results.length <= 0) {
            db.query(sql.kakaoJoin, [kakao.user_id, kakao.user_id, kakao.user_email], function (error, result) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: 'error' });
                }
                return response.status(200).json({message:'저장완료'})
            })
        } else {
        // 로그인
            db.query(sql.get_user_no, [kakao.user_id], function (error, results, fields) {
                if (error) {
                    console.log(error)
                    return response.status(500).json({ error: 'error' });
                }
                return response.status(200).json({
                    message: results[0].user_no
                })
            })
        }
    })
})

// 네이버 로그인
router.post('/naverlogin', function (request, response) {
    const naverlogin = request.body.naverlogin;

    //0717 23:26추가 네이버 중복 로그인 방지
    db.query(sql.naver_id_check, [naverlogin.id], function (error, results, fields) {
        if (error) {
            console.log(error);
            return response.status(500).json({
                message: 'DB_error'
            });
        }
        if (results.length > 0) {
            // 가입된 계정 존재
            db.query(sql.get_user_no, [naverlogin.id], function (error, results, fields) {
                if (error) {
                    console.log(error)
                }
                return response.status(200).json({
                    message: results[0].user_no
                })
            })
        } else {
            // DB에 계정 정보 입력
            db.query(sql.naverlogin, [naverlogin.email, naverlogin.id, naverlogin.nickname, null], function (error, result) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: 'error' });
                } else {
                    return response.status(200).json({
                        message: '저장완료'
                    })
                }
            })
        }
    })
})


// 아이디 찾기
router.post('/findId', function (request, response, next) {
    const name = request.query.name;
    const email = request.query.email;

    db.query(sql.check_id, [email, name], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원 에러' });
        }
        const user_id = results[0].id; // 사용자 아이디를 가져옴
        console.log(user_id);
        return response.status(200).json({
            message: 'user_email',
            user_id: user_id
        });
    });
});

// 비번 찾기
//비번찾기
router.post('/find_pass', function (request, response, next) {
    const email = request.body.email;
    const name = request.body.name;

    db.query(sql.find_pass, [email, name], async function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원 에러' });
        }

        if (results.length == 0) {
            // 이메일이 데이터베이스에 존재하지 않는 경우
            return response.status(404).json({ message: 'user_not_found' });
        }

        const password= generateTempPassword(); // 임시 비밀번호 생성
        function generateTempPassword() {
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let tempPassword = '';
            for (let i = 0; i < 8; i++) {
                tempPassword += chars[Math.floor(Math.random() * chars.length)];
            }
            return tempPassword;
        }

        const encryptedPW = bcrypt.hashSync(password, 10); // 임시 비밀번호 암호화

        // 업데이트
        db.query(sql.pass_update, [encryptedPW, name, email], function (error, results, fields) {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: '비번 에러' });
            }
            console.log(results);
            return response.status(200).json({
                message: password,
                dbResult: results
            });
        });

    });
});

// 임시 비밀번호 메일 전솔

// 아이디 체크
router.post('/id_check', function (request, response) {
    db.query(sql.id_check, [request.body.user_id], function (error, results, fields) {
        if(error) {
            return response.status(500).json({
                message: 'DB_error'
            })
        }
        if (results.length <= 0) {
            return response.status(200).json({
                message: 'available_id'
            })
        }
        else {
            return response.status(200).json({
                message: 'already_exist_id'
            })
        }
    })
})

module.exports = router;
