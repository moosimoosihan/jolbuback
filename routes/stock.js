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
router.get('/coin_info_candle/:coin/:time', (req, res) => {
    const coin = req.params.coin;
    const time = req.params.time;
    axios.get(`https://api.bithumb.com/public/candlestick/${coin}_KRW/${time}`)
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
router.post('/coin_info', (req, res) => {
    var code = req.body.code;
    axios.get(`https://api.bithumb.com/public/ticker/ALL_KRW`)
        .then(response => {
            // code가 소문자의 경우 대문자로 변경
            if(code === code.toLowerCase()){
                code = code.toUpperCase();
            }
            const coin_info = response.data;
            const coin_info_result = Object.keys(coin_info.data).filter(key => key.includes(code)).reduce((obj, key) => {
                obj[key] = coin_info.data[key];
                return obj;
            }, {});
            res.status(200).json(coin_info_result);
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
            res.status(500).json({ success:false, error: '찜하기 중에 오류가 발생했습니다.' });
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
            res.status(500).json({ success:false, error: '찜하기 취소 중에 오류가 발생했습니다.' });
        } else {
            res.status(200).json({ success: true });
        }
    });
});

// 찜한 목록 가져오기
router.post('/check_like', (req, res) => {
    const USER_NO = req.body.user_no;

    db.query(sql.stock_like_check, [USER_NO], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '찜한 목록을 가져오는 중에 오류가 발생했습니다.' });
        } else {
            if(result.length === 0){
                res.status(200).json({ success: false, result: result });
            } else {
                res.status(200).json({ success: true, result: result });
            }
        }
    });
});

// 찜한 목록 종목 정보를 가져오기
router.post('/like_stock_info', (req, res) => {
    const USER_NO = req.body.user_no;
    const stock_like_check = sql.stock_like_check;

    db.query(stock_like_check, [USER_NO], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '찜한 목록을 가져오는 중에 오류가 발생했습니다.' });
        } else {
            if(result.length === 0){
                res.status(200).json({ success: false });
            } else {
                let like_stock_list = [];
                axios.get(`https://api.bithumb.com/public/ticker/ALL_KRW`)
                    .then(response => {
                        const coin_info = response.data;
                        for(let i = 0; i < result.length; i++){
                            const coin_info_result = Object.keys(coin_info.data).filter(key => key.includes(result[i].STOCK_NAME)).reduce((obj, key) => {
                                obj[key] = coin_info.data[key];
                                return obj;
                            }, {});
                            like_stock_list.push(coin_info_result);
                        }
                        res.status(200).json(like_stock_list);
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).json({ error: '코인 정보를 가져오는 중에 오류가 발생했습니다.' });
                    }
                )
            }
        }
    })
});

module.exports = router;
