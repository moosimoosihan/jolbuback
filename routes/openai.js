const db = require('../db/db');
const sql = require('../sql.js');
const { OpenAI } = require('openai');
const express = require('express');
const {Router} = require("express");
const router = express.Router();
require('dotenv').config();

// GPT-3 API 호출 라우터
// router.post('/aichat', async (req, res) => {
//     try {
//         const text = req.body.text;
//         const response = await callChatGPT(text);
//         res.status(200).json(response);
//     } catch (err) {
//         console.error(err);
//     }
// })
// GPT-3 API 호출 함수 나중에 역할 및 내용 바꿀 예정
async function callChatGPT(text) {
    try {
        const openai = new OpenAI({
            apiKey: process.env['OPENAI_API_KEY']
        });
        const gptResponse = await openai.chat.completions.create({
            messages: [
                {role: 'user', content: text}
            ],
            model: 'gpt-3.5-turbo'
        })
        return gptResponse.choices[0].message.content;
    } catch (err) {
        console.error(err);
    }
}

// 날짜 계산문
router.post('/aichat', async (req, res) => {
    const user_no = req.body.user_no; //고유 넘버를 받아옵니다.
    let text = '';
    // DB에서 해당 사용자의 마지막 AI 실행 일자를 조회합니다.
    db.query(sql.ai_time_check, [user_no], async (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({message: 'DB 오류가 발생했습니다.'});
        }
        //만약에 출력된 현재 날짜가 한달 이내 한번 동작되었다면 실행불가하게 만들기
        if (result.length===0) {
            // 사용자의 관심 종목, 투자 성향 등 정보를 받아와 프롬포트 제작 후 ai에게 전달
            db.query(sql.mystock_list, [user_no], (err, result_myStock_list) => {
                if(err) {
                    console.error(err);
                    return res.status(500).json({message: 'DB 오류가 발생했습니다.'});
                }
                if(result_myStock_list.length<5){
                    return res.status(200).json({message: '관심 종목이 5개 미만입니다.'});
                }
                db.query(sql.check_pns, [user_no], async (err, result_pns) => {
                    text = '내가 관심있는 종목은 ' + result_myStock_list[0].STOCK_NAME + '이거야, 그리고 내 성향은' + result_pns[0].pns + '이야,' +
                        '이런 나에게 어울리는 코인 종목은 무엇일까? 설명 없이 단답으로 5개만 코드명으로만 얘기해줘' +
                        '대답 예시는 AAA,BBB,CCC,DDD,EEE 이런식으로 해줘';
                    try {
                        const response = await callChatGPT(text);
                        // AI 실행이 성공하면 DB에 현재 일자를 저장합니다.
                        db.query(sql.openai_response, [user_no, text, response], (err, result) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({message: 'DB 오류가 발생했습니다.'});
                            }
                            return res.status(200).json({message: response});
                        })
                    } catch (err) {
                        console.error(err);
                    }
                })
            })
        } else {
            // 한달 이내에 실행한 적이 있다면 실행을 허용하지 않습니다.
            const lastAiDate = new Date(result[0].AI_DATE); //데이터베이스에서 가져온 값 (마지막 날짜)
            const currentDate = new Date(); //현재 실행된 시간
            if (currentDate.getMonth() === lastAiDate.getMonth() && currentDate.getFullYear() === lastAiDate.getFullYear()) {
                return res.status(200).json({message: '이미 한달 이내에 실행한 적이 있습니다.'});
            }
            // 사용자의 관심 종목, 투자 성향 등 정보를 받아와 프롬포트 제작 후 ai에게 전달
            db.query(sql.mystock_list, [user_no], (err, result_myStock_list) => {
                if(err) {
                    console.error(err);
                    return res.status(500).json({message: 'DB 오류가 발생했습니다.'});
                }
                if(result_myStock_list.length<5){
                    return res.status(200).json({message: '관심 종목이 5개 미만입니다.'});
                }
                db.query(sql.check_pns, [user_no], async (err, result_pns) => {
                    text = '내가 관심있는 종목은 ' + result_myStock_list[0].STOCK_NAME + '이거야, 그리고 내 성향은' + result_pns[0].pns + '이야,' +
                        '이런 나에게 어울리는 코인 종목은 무엇일까? 설명 없이 단답으로 5개만 코드명으로만 얘기해줘' +
                        '대답 예시는 AAA,BBB,CCC,DDD,EEE 이런식으로 해줘';
                    try {
                        const response = await callChatGPT(text);
                        // AI 실행이 성공하면 DB에 현재 일자를 저장합니다.
                        db.query(sql.openai_response, [user_no, text, response], (err, result) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({message: 'DB 오류가 발생했습니다.'});
                            }
                            return res.status(200).json({message: response});
                        })
                    } catch (err) {
                        console.error(err);
                    }
                })
            })
        }
    })
});

module.exports = router;
