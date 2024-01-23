const express = require('express');
const cors = require('cors');
const app = express();

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
