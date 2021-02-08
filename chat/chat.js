const express = require('express');
const path = require('path');
const app  = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const moment = require('moment');
const port = 3000;


// for socket io
app.use('/resources', express.static(path.join(__dirname, 'resources')));


const chatBot = 'Admin';

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

server.listen(port ,() =>{
    console.log('Chat is running on port:', port)
});

io.on('connection', (socket) => {

    let UserID =  chatBot + ": New user is connected " ;
    socket.broadcast.emit('chat message', UserID);
    socket.on('chat message', (msg) => {
        msg = socket.id + ' : ' + moment().format("DD MMM YYYY, h:mm:ss a")+ ' : ' + msg;


        io.emit('chat message', msg);
    });
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        let UserID = chatBot + ": User disconnected! " ;
        socket.broadcast.emit('chat message', UserID);
    });
});


