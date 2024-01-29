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

// 모의 투자 금액 가져오기
router.get('/simulatedAmount/:user_no', (req, res) => {
const user_no = req.params.user_no;
    db.query(sql.simulatedAmount, [user_no], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: '시뮬레이션 금액을 가져오는 중에 오류가 발생했습니다.' });
        } else {
            res.status(200).json({ result: result[0].simulatedamount });
        }
    })
})

// 모의 투자 금액 업데이트
router.post('/update_simulatedAmount', (req, res) => {
    const user_no = req.body.user_no;
    const code = req.body.code;
    const trade_price = req.body.trade_price;
    const trade_amount = parseInt(req.body.trade_amount);
    const sell = req.body.sell; // 매도(true)인지 매수(false)인지 구분

    db.query(sql.simulatedAmount, [user_no], (err, result) => {
        if(!sell){
            // 매수일 경우
            if(result[0].simulatedamount < trade_price){
                // 시뮬레이션 금액이 부족할 경우
                return res.status(200).json({ message : '금액이 부족합니다.' });
            }
            // 현재 코드를 매수한 이력이 있는지 확인
            db.query(sql.check_mock_stock, [user_no, code], (err_check, result_check) => {
                if(err_check){
                    return res.status(500).json({ error: '이력 확인 DB 오류' });
                }
                if(result_check.length === 0) {
                    // 현재 코드를 매수한 이력이 없을 경우 바로 입력하기
                    db.query(sql.insert_mock_stock, [user_no, code, trade_price, trade_amount], (err_mock, result_insert) => {
                        if(err_mock){
                            return res.status(500).json({ error: '입력 DB 오류' });
                        }
                    })
                } else {
                    // 현재 코드를 매수한 이력이 있을 경우 해당 코드의 매수 금액과 수량을 업데이트
                    // 평단가 (이전 매수 수량 * 이전 매수가) + (현재 매수 수량 * 현재 매수가) / (이전 매수 수량 + 현재 매수 수량)
                    let avg1 = (parseInt(result_check[0].MOCK_PRICE)*parseInt(result_check[0].MOCK_AMOUNT))+(trade_price*trade_amount)
                    let avg = avg1/(parseInt(result_check[0].MOCK_AMOUNT)+trade_amount)
                    const amount = parseInt(result_check[0].MOCK_AMOUNT) + trade_amount;
                    db.query(sql.update_mock_stock, [avg, amount, user_no, code], (err_mock, result_update) => {
                        if(err_mock){
                            console.error(err_mock);
                            return res.status(500).json({ error: '업데이트 DB 오류' });
                        }
                    })
                }
                // 매수 후 시뮬레이션 금액 업데이트
                const simulatedAmount = parseInt(result[0].simulatedamount) - trade_price * trade_amount;
                db.query(sql.update_simulated_amount, [simulatedAmount, user_no], (err_update, result_update) => {
                    if(err_update){
                        console.error(err_update);
                        return res.status(500).json({ error: '매수 후 금액 업데이트 DB 오류' });
                    }
                    return res.status(200).json({ message : '매수 성공' });
                })
            })
        } else {
            // 매도일 경우
            // 현재 코드를 매수한 이력이 있는지 확인
            db.query(sql.check_mock_stock, [user_no, code], (err_check, result_check) => {
                if (err_check) {
                    console.error(err_check);
                    return res.status(500).json({error: '이력 확인 DB 오류'});
                }
                if(result_check.length === 0){
                    return res.status(200).json({ message : '매도할 종목 없음' });
                } else {
                    // 매도 할 수 있는 수량인지 확인
                    if(result_check[0].MOCK_AMOUNT < trade_amount){
                        return res.status(200).json({ message : '수량 부족' });
                    }
                    // 현재 코드를 매수한 이력이 있을 경우 해당 코드의 매수 금액과 수량을 업데이트
                    // 평단가 (이전 매수 수량 * 이전 매수가) + (현재 매수 수량 * 현재 매수가) / (이전 매수 수량 + 현재 매수 수량)
                    const amount = parseInt(result_check[0].MOCK_AMOUNT) - trade_amount;
                    if(amount === 0){
                        // 매도 후 수량이 0일 경우
                        db.query(sql.delete_mock_stock, [user_no, code], (err_mock, result_delete) => {
                            if(err_mock){
                                console.error(err_mock);
                                return res.status(500).json({ error: '삭제 DB 오류' });
                            }
                        })
                    } else {
                        // 매도 후 수량이 0이 아닐 경우
                        db.query(sql.update_mock_stock_amount, [amount, user_no, code], (err_mock, result_update) => {
                            if(err_mock){
                                console.error(err_mock);
                                return res.status(500).json({ error: '업데이트 DB 오류' });
                            }
                        })
                    }
                    // 매도 후 시뮬레이션 금액 업데이트
                    const simulatedAmount = parseInt(result[0].simulatedamount) + trade_price * trade_amount;
                    db.query(sql.update_simulated_amount, [simulatedAmount, user_no], (err_update, result_update) => {
                        if(err_update){
                            console.error(err_update);
                            return res.status(500).json({ error: '매도 후 금액 업데이트 DB 오류' });
                        }
                        return res.status(200).json({ message : '매도 성공' });
                    })
                }
            })
        }
    })
})

// 구매한 종목 정보 가져오기
router.post('/sale_stock_info', (req, res) => {
    const user_no = req.body.user_no;
    db.query(sql.all_mock_stock, [user_no], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({ error: 'DB 오류' });
        }
        if(result.length === 0){
            return res.status(200).json({ message : '구매한 종목 없음' });
        } else {
            axios.get(`https://api.bithumb.com/public/ticker/ALL_KRW`)
                .then(response => {
                    let sale_stock_list = [];
                    let coin_info = response.data;
                    // 구매한 종목의 가격, 수량, 총 금액, 수익률을 계산하여 반환
                    for(let i = 0; i < result.length; i++){
                        let coin_info_result = Object.keys(coin_info.data).filter(key => key.includes(result[i].MOCK_NAME)).reduce((obj, key) => {
                            obj[key] = coin_info.data[key];
                            return obj;
                        }, {});
                        let total_price = parseInt(result[i].MOCK_PRICE) * parseInt(result[i].MOCK_AMOUNT);
                        let rate_price = ((coin_info_result[Object.keys(coin_info_result)[0]].closing_price)*result[i].MOCK_AMOUNT) - (result[i].MOCK_PRICE*result[i].MOCK_AMOUNT);
                        let rate = (coin_info_result[Object.keys(coin_info_result)[0]].closing_price - result[i].MOCK_PRICE) / result[i].MOCK_PRICE * 100;
                        sale_stock_list.push({
                            MOCK_NAME : result[i].MOCK_NAME,
                            MOCK_PRICE : result[i].MOCK_PRICE,
                            MOCK_AMOUNT : result[i].MOCK_AMOUNT,
                            TOTAL_PRICE : total_price,
                            RATE : rate,
                            rate_price: rate_price,
                            closing_price : coin_info_result[Object.keys(coin_info_result)[0]].closing_price
                        });
                    }
                    res.status(200).json(sale_stock_list);
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ error: '코인 정보를 가져오는 중에 오류가 발생했습니다.' });
                }
            )
        }
    })
})

module.exports = router;
