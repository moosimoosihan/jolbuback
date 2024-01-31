const express = require('express');
const router = express.Router();
const db = require('../db/db');
const sql = require('../sql.js');
const path = require('path');
const bcrypt = require('bcrypt');

// 회원 탈퇴
router.delete('/mypage/user/:user_no', function (request, response, next) {
    const userNo = request.params.user_no;

    db.query(sql.deleteUser, [userNo], function (error, result, fields) {
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



//모의투자 목록 가져오기
router.get('/mypageai/:user_no',function(request,response,next){
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
