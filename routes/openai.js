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
                {role: 'user', content: text},
                {role: 'assistant',content:text}
            ],
            model: 'gpt-3.5-turbo'
        })
        return gptResponse.choices[0].message.content;   
    } catch (err) {
        console.error(err);
    }
}
/*
날짜 계산문
router.post('/aichat', async (req, res) => {
    try {
        const text = req.body.text;
        const response = await callChatGPT(text); //gpt를 불러옴
        const user_no = req.body.user_no; //고유 넘버를 받아옵니다.
        res.status(200).json(response);

        // DB에서 해당 사용자의 마지막 AI 실행 일자를 조회합니다.
        const result = await db.query('sql.ai_time_check[user_no]);

        //만약에 출력된 현재 날짜가 한달 이내 한번 동작되었다면 실행불가하게 만들기 
        if (result.length() > 0) { 
            const lastAiDate = new Date(result[0].AI_DATE); //데이터베이스에서 가져온 값 (마지막 날짜)
            const currentDate = new Date(); //현재 실행된 시간

            // 한달 이내에 실행한 적이 있다면 실행을 허용하지 않습니다.
            if (currentDate.getMonth() === lastAiDate.getMonth() && currentDate.getFullYear() === lastAiDate.getFullYear()) {
                return res.status(200).json({ message: '이미 한달 이내에 실행한 적이 있습니다.' });
            }
        }
        // 여기에 AI 실행 로직을 넣으세요. (callChatGPT 함수 등)
        console.log("드디여 됬옹 돈 안까웡");

        // AI 실행이 성공하면 DB에 현재 일자를 저장합니다.
        await db.query(sql.update_ai[new Date(), user_no]);
        res.status(200).json({ message: 'AI 실행 성공' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '서버 오류' });
    }
});

module.exports = router;

*/

module.exports = router;
