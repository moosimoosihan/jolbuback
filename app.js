const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:8080',
        credentials: true,
    },
    allowEIO3: true,
    pingTimeout: 5000,
});
io.on('connection', function(socket) {
    socket.on('stock', function(data){
        const msg = {
            stock : data.stock,
        }
        socket.broadcast.emit('stock', msg);
    });
});

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require('./routes/auth');
const mypageRouter = require('./routes/mypage');

app.use('/auth', authRouter);
app.use('/mypage', mypageRouter);

app.listen(3000, () => {
    console.log('Server Running at http://localhost:3000');
});

server.listen(3001, () => {
    console.log('Server Running at http://localhost:3001');
})
