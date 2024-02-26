const express = require('express');
const router = express.Router();
const db = require('../db/db');
const sql = require('../sql.js');
const path = require('path');
const bcrypt = require('bcrypt');

// 관리자 체크
router.post('/admin_check', function (request, response) {
    const user_no = request.body.user_no;
    db.query(sql.admin_check, [user_no], function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '관리자체크에러' });
        }
        if(results[0].ADMIN===1)
            response.status(200).json({auth: 'admin'});
        else
            response.status(200).json({auth: 'user'});
    });
})

// 회원 수, 관리자 수, 구매 수, AI 응답 수
router.get('/count', function (request, response) {
    db.query(sql.count_user, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원수에러' });
        }
        const user_count = results[0].user_count;
        db.query(sql.count_admin, function (error, results, fields) {
            if (error) {
                console.error(error);
                return response.status(500).json({ error: '관리자수에러' });
            }
            const admin_count = results[0].admin_count;
            db.query(sql.count_buy, function (error, results, fields) {
                if (error) {
                    console.error(error);
                    return response.status(500).json({ error: '구매수에러' });
                }
                const buy_count = results[0].buy_count;
                db.query(sql.count_ai, function (error, results, fields) {
                    if (error) {
                        console.error(error);
                        return response.status(500).json({ error: 'AI응답수에러' });
                    }
                    const ai_count = results[0].ai_count;
                    response.status(200).json({user_count: user_count, admin_count: admin_count, buy_count: buy_count, ai_count: ai_count});
                });
            });
        });
    });
});

// 구매한 날짜와 구매한 수 차트로 최근 7일만 보여주기
router.get('/buyChart', function (request, response) {
    db.query(sql.buyChart, function (error, results, fields) {
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '구매차트에러' });
        }
        response.status(200).json(results);
    });
});
//모의투자 유저 목록져오기
router.get('/mypagemkall/:user_no',function(request,response,next){
    const user_no = request.params.user_no;

    db.query(sql.get_AImock_all,[user_no],function(error,results,fields){
        if (error) {
            console.error(error);
            return response.status(500).json({ error: '회원에러' });
        }
        response.json(results);
    });
})
// 유저들의 수익률을 내림차순으로 정렬하여 가져오기
router.get('/mock_rank', (req, res) => {
    db.query(sql.mock_rank, (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'DB 오류' });
        }
        if(result.length === 0){
            return res.status(200).json({ message : '유저 없음' });
        } else {
            return res.status(200).json(result);
        }
    })
})

// 모든 유저 불러오기
router.get('/get_alluser', (req, res) => {
    db.query(sql.all_user, (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'DB 오류' });
        }
        if(result.length === 0){
            return res.status(200).json({ message : '유저 없음' });
        } else {
            return res.status(200).json(result);
        }
    })
})

// 최고 거래량 5개 종목 불러오기
router.get('/volume_rank', (req, res) => {
    db.query(sql.volume_rank, (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'DB 오류' });
        }
        if(result.length === 0){
            return res.status(200).json({ message : '종목 없음' });
        } else {
            return res.status(200).json(result);
        }
    })
})

// 최고 변동량 5개 종목 불러오기
router.get('/change_rank', (req, res) => {
    db.query(sql.change_rank, (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'DB 오류' });
        }
        if(result.length === 0){
            return res.status(200).json({ message : '종목 없음' });
        } else {
            return res.status(200).json(result);
        }
    })
})

router.get('/allai', function (request, response, next) {

    db.query(sql.all_openai, function (error, results, fields) {
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

module.exports = router;
