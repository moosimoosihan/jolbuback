const express = require('express');
const router = express.Router();
const db = require('../db/db');
const sql = require('../sql.js');
const path = require('path');
const bcrypt = require('bcrypt');
const axios = require('axios');
const updateStock = require('../updateStock.js');


// 채팅 전송
router.post('/send', function(request, response) {
    const chat_content = request.body.chat_content;
    const user_no = request.body.user_no;
    // 채팅 전송후 db에 저장
    db.query(sql.sendChat, [chat_content, user_no], function(error, results, fields){
        if(error){
            console.error(error);
            return response.status(500).json({error: 'send_chat_error'});
        }
        return response.status(200).json({
            message: 'success',
        });
    })
})

// 채팅 불러오기
router.get('/get_chat', function(request, response) {
    db.query(sql.getChat, function(error, results, fields){
        if(error){
            console.error(error);
            return response.status(500).json({error: 'get_chat_error'});
        }
        return response.status(200).json({
            message: 'get_chat_success',
            data: results,
        });
    })
})

// 나의 이름만 가져오기
router.get('/get_name/:user_no', function(request, response) {
    const user_no = request.params.user_no;
    db.query(sql.get_name, [user_no],function(error, results, fields){
        if(error){
            console.error(error);
            return response.status(500).json({error: 'get_name_error'});
        }
        return response.status(200).json(results);
    });
})

module.exports = router;
