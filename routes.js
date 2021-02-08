const express = require("express");
const session = require('express-session');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const port = 8080;

const app = express();
const database = require('./database');

app.use(express.static("frontend"));
app.use(bodyParser.urlencoded({extended : true})); //SE HER
app.use(bodyParser.json());

app.set('views',path.join(__dirname,'frontend/views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname + '/frontend/login.html'));
});


app.post('/auth', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
        let encryptedPassword;

        function getClearPassword() {
            connection.query("SELECT password FROM users WHERE email = ?", [email, password],  (error, result, fields) => {
                let passwordResult = JSON.stringify(result);
                return encryptedPassword = passwordResult.substring(14, 74);
            });
        }

        getClearPassword();

        connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password],  (error, result, fields) =>{
            if (bcrypt.compareSync(password, encryptedPassword) === true)  {
                req.session.loggedin = true;
                req.session.email = email;
                res.redirect('/activity');
            } else {
                res.send('Incorrect Username or Password!');
            }
            res.end();
        });
    } else {
        res.redirect("/");
        res.end();
    }
});


app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});


app.get('/activity',(req,res) => {
    if(req.session.loggedin) {
        res.sendFile(path.join(__dirname + '/frontend/activity.html'));
    } else {
        res.redirect('/');
    }
});


function confirmationMail(confirmationAcc) {

    let transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL, //
        to: confirmationAcc,
        subject: 'Welcome ' + confirmationAcc,
        text: 'Your account ' + confirmationAcc + ' has been successfully created!'
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('Email not sent...');
        }
        return console.log('Confirmation sent...');
    });
}


app.get('/signup', (req, res) => {
    res.render('sign_up', {
        title: 'Create a user'
    });
});


app.get('/users',(req, res) => {
    if (req.session.loggedin) {
        let sql = "SELECT * FROM users";
        let query = connection.query(sql, (err, rows) => {
            if (err) throw err;
            res.render('user_list.ejs', {
                title: 'Users',
                users: rows
            });
        });
    } else {
        res.redirect("/");
    }
});


app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/users');
    });
});

app.post('/save',  (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const plainPassword = req.body.password;
    let password = bcrypt.hashSync(plainPassword, 10);
    const data = {name, email, password};
    let sql = "INSERT INTO users SET ?";
    connection.query(sql, data,(err, results) => {
        if(err) {
            res.redirect('/signup');
            throw err;
        } else{
            res.redirect('/signup')
            confirmationMail(email);}
    });
});

app.listen(port, (error) => {

    if (error) {
        console.log("There is an error starting the server:", error);
    }
    console.log("Server is running on port:", port);
});