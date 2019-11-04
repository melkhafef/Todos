const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('express-jwt-session');
const cors = require('cors');
const mysqlStore = require('express-mysql-session')(session);
const path = require('path');
const app = express();
var options = {
    host: 'sql9.freesqldatabase.com',
    port: 3306,
    user: 'sql9310613',
    password: 'Wb3yisPqPr',
    database: 'sql9310613'
};
var sessionStore = new mysqlStore(options);
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));
let conection = mysql.createConnection(options);
conection.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/dist/todoTask'));
app.use(cors());
app.get('/', (req, res) => {
    res.redirect('/login');
})
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname+'/dist/todoTask/index.html'));
})
app.post('/login', function (req, res) {
    let sql = `select * from user where name='${req.body.name}' AND password=${req.body.password}`
    conection.query(sql, (err, respons) => {
        if (err) throw err;
        if (respons.length != 0) {
            console.log(respons);
            const secret = 'ssshhh';
            let token = jwt.signToken({ name: req.body.name, password: req.body.password }, secret, 150);
            console.log(respons[0].id);
            res.status(200).json({ userId: respons[0].id, token: token });
            res.end();
        }
        else {
            console.log('invalid');
            res.send('invalid username or password');
        }
    })
});
app.get('/user/:id/todos', function (req, res) {
    console.log('read');
    let sql = `select * from todo where user_id=${parseInt(req.params.id)}`
    conection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    })
})
app.put('/todos/:id', function (req, res) {
    let sql = `update todo SET title='${req.body.title}',description='${req.body.description}',duedate='${req.body.duedate}'    where id=${req.params.id}`
    conection.query(sql, (err, result) => {
        if (err) throw err;
        res.end();
    })
})
app.delete('/todos/:id', function (req, res) {
    let sql = `DELETE FROM todo WHERE id=${req.params.id}`;
    conection.query(sql, (err, result) => {
        if (err) throw err;
        res.end();
    })
})
app.post('/user/:id/todos', function (req, res) {
    let sql = `insert into todo (title,description,duedate,isdone,user_id) values ('${req.body.title}',
        '${req.body.description}','${req.body.duedate}',${false},${req.params.id})`
    conection.query(sql, (err, result) => {
        if (err) throw err;
        res.end();
    })
})
app.put('/todos', (req, res) => {
    let sql = `update todo set isdone=true where id=${req.body.todoId}`
    conection.query(sql, (err, resulte) => {
        if (err) throw err;
        res.end();
    })
})
app.listen(process.env.PORT || 3000);