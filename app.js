const express = require('express');
const cors = require('cors');
const app = express();
const trigger = require('./trigger');
const server = require('http').createServer(app); // http 서버 생성
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:8080',
        credentials: true,
    },
    allowEIO3: true,
    pingTimeout: 5000,
}); // socket.io 서버 생성

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
trigger();
const authRouter = require('./routes/auth');
const mypageRouter = require('./routes/mypage');
const stockRouter = require('./routes/stock');
const openaiRouter = require('./routes/openai');
const adminRouter = require('./routes/admin');
const chatRouter = require('./routes/chat');

app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);
app.use('/stock', stockRouter);
app.use('/openai', openaiRouter);
app.use('/admin', adminRouter);
app.use('/chat', chatRouter);

io.on('connection', function(socket) {
    socket.on('chat', function(data){
        const msg = {
            chat_user : data.chat_user,
            name : data.name,
            chat_content : data.chat_content,
        }
        socket.broadcast.emit('chat', msg);
    });

});
server.listen(3001, function() {
    console.log('Socket IO Server Running at http://localhost:3001');
})
app.listen(3000, () => {
    console.log('Server Running at http://localhost:3000');
});
