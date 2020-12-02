var express = require('express');
var app = express();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
const server = http.createServer(app);
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const { addUser, removeUser, getUser, getOnlineUsers } = require('./users')

var userRoutes = require('./routes/routes');
const con = require('./config/connection/connection');
const jwtHelper = require('./config/vertifyToken/jwtHelper');

const PORT = process.env.PORT || 5000

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('user connect');
  socket.on('join', ({ firstName, lastName, email, defaultRoom }, callback) => {
    const { error, onlineUser } = addUser({ id: socket.id, firstName, lastName, email, defaultRoom });
    socket.join(onlineUser.defaultRoom);
 
    if (error) {
      io.to(defaultRoom).emit('roomData', { room: defaultRoom, users: getOnlineUsers() });
      return callback(error);
    }
    io.to(onlineUser.defaultRoom).emit('roomData', { room: onlineUser.defaultRoom, users: getOnlineUsers() });
    callback();

  });

  socket.on('sendMessage', (message, callback) => {
    console.log(message)
    const user = getUser(socket.id);
    console.log(socket.id)
     socket.broadcast.to(message.id).emit('message', {user:user.firstName , text: message.text });
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.defaultRoom).emit('roomData', { room: user.defaultRoom, users: getOnlineUsers() });
      console.log("user disconnected");
      return 0;
    }
    console.log("disconnected");
  })

})

app.use('/user', userRoutes);
app.use('/getData',jwtHelper.verifyJwtToken,userRoutes);



server.listen(PORT, () => console.log(`good to go ${PORT}`));

module.exports = app;
