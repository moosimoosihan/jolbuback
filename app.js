const express = require('express');
const cors = require('cors');
const app = express();
const updateStock = require('./updateStock');

// 서버 관련
const WebSocket = require("ws");

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routes/auth');
const mypageRouter = require('./routes/mypage');
const stockRouter = require('./routes/stock');

app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/stock', stockRouter);

app.listen(3000, () => {
    console.log('Server Running at http://localhost:3000');
});

// 주식 소캣
const ws = new WebSocket("wss://api.upbit.com/websocket/v1");

ws.on("open", () => {
    ws.send(`[{"ticket": "test example"},{"type": "ticker", "codes": ["KRW-BTC", "KRW-ETH"]},{"format": "DEFAULT"}]`);
});

ws.on("error", console.error);
var stock;
ws.on("message", (data) => {
    stock = JSON.parse(data.toString())
    updateStock(stock);
});
ws.on("close", () => console.log("closed!"));
