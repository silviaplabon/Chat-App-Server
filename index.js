const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require('cors');
const io = require("socket.io")(server, {
});

// const io = require('socket.io')();
app.use(cors())

const port = 4000;


let roomId;
let roomUser;
let receiverSocketId, userSocketId;
let connectedCount = 0;

const { addUser, getUser, getUsersInRoom, getFromAllUsers, deleteAllPreviousData, availableOneAnotherRoom, getAllUser, removeUserByNameRoom, getUserByName, deleteUsersInRoomWithUser, removeUser } = require('./users');


io.sockets.on('connect', (socket) => {
  connectedCount += 1;
  console.log(connectedCount, "connected count")
  //when a user is exist then it will create a room for user.Then by roomInformation event user can get his room id. 
  console.log(socket.id, "socket id from connection")
  socket.on('join', (name, callback) => {
    const room = name;
    deleteAllPreviousData(name); //delete previous data if exist
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    console.log(user.room, "user room information")
    socket.join(user.room);
    callback();
  });

  socket.on('sendRequest', (data, callback) => {
    console.log(data, "data from send Request")
    const receiverData = getFromAllUsers(data.receiver, data.room); // Getting receiver data  and checking if it exists in a different room
    console.log(receiverData, "Receiver data is available here")
    getAllUser()
    const roomCreated = availableOneAnotherRoom(data.sender, data.receiver)
    console.log(roomCreated, "room is created")
    if (receiverData && roomCreated === false) {
      console.log(receiverData, "users data", data.room, data.sender, data.receiver, "users data and dash dash")
      const { error, user } = addUser({ id: receiverData.id, name: receiverData.name, room: data.room });
      if (error) return callback(error);
      socket.join(user.room);
      socket.room = user.room;
      console.log(socket.room, "socket room id")
      removeUserByNameRoom(receiverData.name, receiverData.room, receiverData.id);//after adding it at a room ,then remove receiver room id and details.
      getAllUser();
      io.sockets.connected[receiverData.id].emit('sendMessageRequest', { user: `${data.sender}` });
      callback();
    }
    if (roomCreated == true) { callback(); }
    else { const error = 'user is not available for chat'; return callback(error) }
  })

  socket.on('gettingRoomData', (data, callback) => {
    const sender = getUserByName(data?.sender);
    const receiver = getUserByName(data?.receiver);
    if (sender.room === receiver.room) {
      socket.to(sender.id).emit('roomData', { room: sender.room, users: getUsersInRoom(sender.room) });
      socket.to(receiver.id).emit('roomData', { room: sender.room, users: getUsersInRoom(sender.room) });
      userSocketId = sender.id;
      receiverSocketId = receiver.id;
      console.log(userSocketId, receiverSocketId, "user socket id and receiver socket id")
      roomId = sender?.room;
      console.log(roomId)
    }


    callback();
  })

  // socket.on('online', (data) => {
  //   socket.broadcast.emit('online', data)
  //   console.log(data, "data from online socket io broadcast emit")
  // });

  // // user is typing or not typing operation
  // socket.on('typing', (data) => {
  //   console.log(data, "data from typing")
  //   socket.broadcast.emit('typing', data);
  // });

  socket.on('sendMessage', (data, callback) => {
    console.log(data)
    console.log(data.socketId, "receiver socket id from send message")
    const to = data?.socketId;
    socket.to(to).emit('message', { id: data?.id, user: data?.sender, text: data?.message, sendTime: data?.sendTime, delivered: false })
    callback();
  });


  socket.on('callerCreateRoomIdAndSendToReceiver', (data, callback) => {
    console.log(data, "callerCreateRoomIdAndSendReceiver")
    const to = data?.socketId;
    console.log(to, "from caller creat eroom and receiver")
    socket.to(to).emit('callerCreateRoomIdAndSendToReceiver', { sender: data?.sender, roomId: data?.roomId });
    callback();
  });

  // Handler for 'received' event
  socket.on('received', function (options) {
    console.log(options, "options from client")
    // Emit 'delivered' event: if user send successfully message to the server then it will return delivered option as true 
    io.emit('received', options);
  });

  // socket.on('markSeen', function (options) {
  //   const id = options.userId;
  //   const user = getUser(id);
  //   // Emit 'delivered' event
  //   console.log(options, "options from client")
  //   socket.emit('markedSeen', options);
  // });

  socket.on('forceDisconnect', (data, callback) => {
    disconnectingUserAndReceiver(userSocketId,receiverSocketId,false);
    console.log('disconnect from force disconnected')
    callback();
  })

  const disconnectingUserAndReceiver = (userSocketId, receiverSocketId, state) => {
    console.log(state,"state from disconnecting user and receiver")
    if (userSocketId) {
      removeUser(userSocketId);
      if (state === true) {
        socket.to(userSocketId).emit('disconnectedUser', { user: userSocketId });
      }
      socket.leave(userSocketId);
      getAllUser()
    }
    if (receiverSocketId) {
      removeUser(receiverSocketId);
      if (state === true) {
        socket.to(receiverSocketId).emit('disconnectedUser', { user: receiverSocketId });
      }
      socket.leave(receiverSocketId);
      getAllUser()
    }
  }

  socket.on('disconnect', () => {
    connectedCount -= 1;
    console.log('disconnect', socket.id)
    disconnectingUserAndReceiver(userSocketId, receiverSocketId, true)
  })
});



io.listen(4000, {
  cors: {
    origin: ["https://20bf-103-134-241-251.ngrok.io"]
  }
});
