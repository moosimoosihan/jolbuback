const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const updateStock = require('./updateStock');

// 서버 관련
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require('uuid');
const WebSocket = require("ws");

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:8080',
        credentials: true,
    },
    allowEIO3: true,
    pingTimeout: 5000,
});

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

server.listen(3001, () => {
    console.log('Server Running at http://localhost:3001');
})

// 주식 소캣
const payload = {
    access_key: "ixEvMaCGj5nRdP0Va5qSGXQmBRe4R7BatWNRS8qw",
    nonce: uuidv4(),
};

const jwtToken = jwt.sign(payload, "vOhCXONVCipBvstgqcF2QkH4o7SyQkS4W4LViLeN");

const ws = new WebSocket("wss://api.upbit.com/websocket/v1", {
    headers: {
        authorization: `Bearer ${jwtToken}`
    }
});

ws.on("open", () => {
    ws.send(`[{"ticket": "test example"},{"type": "ticker", "codes": ["KRW-BTC", "KRW-ETH"]},{"format": "DEFAULT"}]`);
});

ws.on("error", console.error);
var stock;
ws.on("message", (data) => {
    stock = JSON.parse(data.toString())
    updateStock(stock);
});
io.on('connection', function(socket) {
    socket.on('stock', function(data){
        console.log(stock)
        socket.broadcast.emit('stock', stock);
    });
});
ws.on("close", () => console.log("closed!"));
