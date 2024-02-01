const express = require('express');
const router = express.Router();
const db = require('../db/db');
const sql = require('../sql.js');
const path = require('path');
const bcrypt = require('bcrypt');

// 회원 탈퇴
router.delete('/mypageUser/:user_no', function (request, response, next) {
    const userNo = request.params.user_no;

    db.query(sql.delete_user, [userNo], function (error, result, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원탈퇴에러' });
        }
        return response.status(200).json({ message: '회원탈퇴성공' });
    });
});

// 정보 수정
router.post('/mypageupdate', function (request, response, next) {
    const user = request.body;
    db.query(sql.mypage_update, [user.NAME, user.EMAIL, user.PNS, user.USER_NO], function (error, result, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: 'mypage_update_error' });
        }
        return response.status(200).json({ message: 'Update successful' }); // 성공적인 경우 응답을 추가했습니다.
    });
});
// 비밀번호 변경
router.post('/pass_process', function (request, response) {
    const plainPassword = request.body.user_pw;  // 클라이언트에서 전달받은 평문 비밀번호
    const user_no = request.body.user_no;
    db.query(sql.get_password, [user_no], function (error, results, fields) {
        if (results.length === 0) {
            if (error) {
                console.log('Results in if (error):', results);
                return response.status(500).json({
                    message: 'DB_error'
                });
            }
        } else {
            const same = bcrypt.compareSync(plainPassword, results[0].password);  // 평문 비밀번호와 해시된 비밀번호를 비교
            if (!same) {  // 비밀번호가 일치하지 않을 경우
                console.log('Results in if (!same):', results);
                return response.status(500).json({
                    message: 'pw_ck'
                });
            }
            const hashedPassword = bcrypt.hashSync(request.body.user_npw, 10);
            db.query(sql.mypage_pass_update, [hashedPassword, user_no], function (error, results, fields) {
                if (error) {
                    return response.status(500).json({
                        message: 'DB_error'
                    });
                }
                return response.status(200).json({
                    message: 'pass_update'
                });
            });
        }
    });
});



//내 정보 가져오기
router.get('/mypage/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;

    db.query(sql.get_user_info, [user_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원에러' });
        }
        response.json(results);
    });
});
//내 AI 답변 가져오기
router.get('/mypageai/:user_no', function (request, response, next) {
    const user_no = request.params.user_no;

    db.query(sql.user_openai, [user_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원에러' });
        }
        const processedResults = results.map(result => ({
            ...result,
            ai_response: result.ai_response.replace(/[^\x00-\x7F]/g, ''), // 정규식을 사용하여 한글을 제외
          }));
        response.json(processedResults);
    });
});
//모의투자 목록 가져오기
router.get('/mypagemk/:user_no',function(request,response,next){
    const user_no = request.params.user_no;

    db.query(sql.get_AImock,[user_no],function(error,results,fields){
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원에러' });
        }
        response.json(results);
    });
})




module.exports = router;
