const express = require('express');
const router = express.Router();
const db = require('../db/db');
const sql = require('../sql.js');
const path = require('path');
const bcrypt = require('bcrypt');

// 주식 관련

// 주식 정보 가져오기
router.get('/all_stock_info', async (req, res) => {
    db.query(sql.all_stock_info, (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ error: 'error' });
        } else {
            return res.status(200).json(result);
        }
    })
});

// 주식 정보 가져오기
router.get('/stock_info/:code', async (req, res) => {
    const code = req.params.code;
    db.query(sql.stock_info, [code], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({ error: 'error' });
        } else {
            return res.status(200).json(result);
        }
    })
})

module.exports = router;
