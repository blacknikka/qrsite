var express = require('express');
var fbman = require('./src/firebase');
var csvmanager = require('./src/csv');
var app = express();

// firebaseのイニシャルを行う
fbman.init();

app.get('/', (req, res) => {
    res.send('welcome1');
});

app.get('/signup', async (req, res) => {
    // サインアップ
    // http://localhost:3000/signup?mail=mail2@test.com&psw=password
    var mail = req.query.mail;
    var psw = req.query.psw;
    if (mail.match(/^[A-Za-z0-9]+[\w-]+@[\w\.-]+\.\w{2,}$/)
        && psw != '') {
        let ret = await fbman.addUser(mail, psw);

        res.json(ret);
    }
    else {
        let ret = { 'result': false };
        res.json(ret);
    }
});

app.get('/signin', async (req, res) => {
    // サインイン
    // http://localhost:3000/signin?mail=mail2@test.com&psw=password
    var mail = req.query.mail;
    var psw = req.query.psw;

    let ret = {};
    if (mail.match(/^[A-Za-z0-9]+[\w-]+@[\w\.-]+\.\w{2,}$/)
        && psw != '') {
        if (await fbman.checkuser(mail, psw) === true) {
            // ユーザ認証OK
            // データベースにアクセスしてデータを取得
            const data = await fbman.getdata();
            ret = data;
        }
        else {
            ret['result'] = false;
        }
    }
    else {
        ret['result'] = false;
    }

    res.json(ret);
});

app.get('/data', async (req, res) => {
    // データのセット
    var kind = req.query.kind;

    // http://localhost:3000/data?filename=./data.csv&kind=machine01
    let data = await csvmanager.read(req.query.filename);
    fbman.adddata(kind, data);

    res.json(data);
});

app.listen(3000, () => {
    console.log('connect');
});