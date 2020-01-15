'use strict';

var express = require('express');
var http = require('http');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var socketIO = require('socket.io');

const app = express();
app.server = http.createServer(app);

// Adding socket.io to the Experss server
const io = socketIO.listen(app.server);

const whitelist = [
    'http://128.0.0.8:1234',
    'http://localhost:1234',
    'http://localhost',
    'http://egan.house',
    'http://lol.wine'
];
const corsOptions = {
    origin: function (origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));

// Basic setup for the server
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// We list the connected sockets, then list functions inside this fn to define protocols
io.sockets.on('connection', (socket) => {

    // Maybe should define some logic to ask a user to input their user name

    // the first string is the protocol passed from the client socket
    socket.on('submitPacket', (formData) => {
        console.log('nickname: ' + formData.nickname);
        console.log('message: ' + formData.message);
        socket.broadcast.emit('someoneSubmittedSomething', formData);
        socket.emit('someoneSubmittedSomething', formData);
    });

    console.log('a user connected');
});

// Finally, listen to the process to start the server
app.server.listen(process.env.PORT || 80, () => {
    console.log(`Started on port ${app.server.address().port}`);
});