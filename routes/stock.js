const express = require('express');
const router = express.Router();
const db = require('../db/db');
const sql = require('../sql.js');
const path = require('path');
const bcrypt = require('bcrypt');
const axios = require('axios');

// 주식 관련

// 주식 정보 가져오기
router.get('/all_coin_info', (req, res) => {
    axios.get("https://api.bithumb.com/public/ticker/ALL_KRW")
        .then(response => {
            const coin_info = response.data;
            res.status(200).json(coin_info);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: '코인 정보를 가져오는 중에 오류가 발생했습니다.' });
        });
});
// 코인 캔들 정보 가져오기
router.get('/coin_info_candle/:coin', (req, res) => {
    const coin = req.params.coin;
    axios.get(`https://api.bithumb.com/public/candlestick/${coin}_KRW/24h`)
        .then(response => {
            const coin_info = response.data;
            res.status(200).json(coin_info);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: '코인 정보를 가져오는 중에 오류가 발생했습니다.' });
        });
});

// 코인 정보 가져오기
router.get('/coin_info/:coin', (req, res) => {
    const coin = req.params.coin;
    axios.get(`https://api.bithumb.com/public/ticker/${coin}_KRW`)
        .then(response => {
            const coin_info = response.data;
            res.status(200).json(coin_info);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: '코인 정보를 가져오는 중에 오류가 발생했습니다.' });
        });
});

// 찜하기 기능
router.post('/add_like', (req, res) => {
    const USER_NO = req.body.user_no;
    const STOCK_NAME = req.body.stock_name; // STOCK_NAME 변수 정의
    const stock_like = sql.stock_like;

    db.query(stock_like, [USER_NO, STOCK_NAME], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '찜하기 중에 오류가 발생했습니다.' });
        } else {
            res.status(200).json({ success: true });
        }
    });
});

// 찜하기 취소 기능
router.post('/delete_like', (req, res) => {
    const USER_NO = req.body.user_no;
    const STOCK_NAME = req.body.stock_name; // STOCK_NAME 변수 정의
    const stock_like_delete = sql.stock_like_delete;

    db.query(stock_like_delete, [USER_NO, STOCK_NAME], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '찜하기 취소 중에 오류가 발생했습니다.' });
        } else {
            res.status(200).json({ success: true });
        }
    });
});
module.exports = router;
