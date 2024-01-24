const db = require('../db/db');
const sql = require('../sql.js');
const { OpenAI } = require('openai');
const express = require('express');
const {Router} = require("express");
const router = express.Router();
require('dotenv').config();

// GPT-3 API 호출 라우터
router.post('/aichat', async (req, res) => {
    try {
        const text = req.body.text;
        const response = await callChatGPT(text);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
    }
})
// GPT-3 API 호출 함수 나중에 역할 및 내용 바꿀 예정
async function callChatGPT(text) {
    try {
        const openai = new OpenAI({
            apiKey: process.env['OPENAI_API_KEY']
        });
        const gptResponse = await openai.chat.completions.create({
            messages: [
                {role: 'system', content: '너는 주식 전문가야'},
                {role: 'user', content: text}
            ],
            model: 'gpt-3.5-turbo'
        })
        return gptResponse.choices[0].message.content;
    } catch (err) {
        console.error(err);
    }
}

module.exports = router;
