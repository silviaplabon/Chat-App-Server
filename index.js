const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 4000;
const cors = require('cors');
app.use(cors());

const { addUser, removeUser, getUser, getUsersInRoom, getFromAllUsers } = require('./users');

io.on('connect', (socket) => {
  console.log('connect')
  socket.on('join', (name, callback) => {
    const room = Date.now() + Math.floor(Math.random() * 1000000)
    console.log(room)

    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    console.log(user.room, "user room information")
    socket.join(user.room);
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.name}.`, delivered: true, id: 1122 });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`, delivered: true, id: 1111 });
    socket.emit('roomInformation', { room: user.room, name: user.name });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    callback();
  });


  socket.on('sendMessageReceiver', (data) => {
    socket.broadcast.emit('messageReceiver', data)
  });

  socket.on('sendRequest', (data,callback) => {
    console.log(data, "data ")
    const usersdata = getFromAllUsers(data.receiver);
    console.log(usersdata, "users data", data.room, data.sender, data.receiver, "users data and dash dash")
    const { error, user } = addUser({ id: usersdata.id, name: usersdata.name, room: data.room });
    if (error) return callback(error);
    console.log(user.room, "user room information")
    socket.join(user.room);
    // socket.broadcast.to(user.room).emit('sendRequestReceiver', {  sender: data.sender, room: data.room  });
    callback();
  })

  socket.on('online', (data) => {
    socket.broadcast.emit('online', data)
  });

  // user is typing or not typing operation
  socket.on('typing', (data) => {
    console.log(data, "data from typing")
    socket.broadcast.emit('typing', data);
  });

  socket.on('sendMessage', (data, callback) => {
    // console.log(message,name,"message name")
    console.log(data, "data from send message")
    socket.broadcast.to(data?.room).emit('message', { id: data?.id, user: data?.sender, text: data?.message, sendTime: data?.sendTime, delivered: false });
    
    callback();
  });



  // Handler for 'received' event
  io.on('received', function (options) {
    console.log(options, "options from client")
    // Emit 'delivered' event 
    io.emit('delivered', options);
  });

  io.on('markSeen', function (options) {
    const id = options.userId;
    const user = getUser(id);
    // Emit 'delivered' event
    console.log(options, "options from client")
    socket.emit('markedSeen', options);
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    console.log(socket.id, "socket id from remove user")
    if (user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('offline', { state: 'offline', name: user.name });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  })
});

server.listen(port, () => console.log("server running on port:" + port));

