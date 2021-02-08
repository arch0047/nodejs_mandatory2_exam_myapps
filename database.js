const mysql = require('mysql');

connection = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.DATAUSER,
    password: process.env.DATAPASS,
    database: process.env.DATABASE
});

connection.connect((error) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Database connected successfully...');
    }
});