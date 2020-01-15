'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

// Adding socket.io to the Experss server
var io = _socket2.default.listen(app.server);

var whitelist = ['http://128.0.0.8:1234', 'http://localhost:1234', 'http://localhost', 'http://egan.house', 'http://lol.wine'];
var corsOptions = {
    origin: function origin(_origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(_origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use((0, _cors2.default)(corsOptions));

// Basic setup for the server
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());

app.use(_express2.default.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '/public/index.html'));
});

// We list the connected sockets, then list functions inside this fn to define protocols
io.sockets.on('connection', function (socket) {

    // Maybe should define some logic to ask a user to input their user name

    // the first string is the protocol passed from the client socket
    socket.on('submitPacket', function (formData) {
        console.log('nickname: ' + formData.nickname);
        console.log('message: ' + formData.message);
        socket.broadcast.emit('someoneSubmittedSomething', formData);
        socket.emit('someoneSubmittedSomething', formData);
    });

    console.log('a user connected');
});

// Finally, listen to the process to start the server
app.server.listen(process.env.PORT || 80, function () {
    console.log('Started on port ' + app.server.address().port);
});