// const express = require('express')
// const app = express()
const bodyParser = require('body-parser');
// require('dotenv').config()


// // socket io import 
// const io = require("socket.io");

// const port = 500;

// const socket = io(http);
// //create an event listener

// //To listen to messages
// socket.on("connection", (socket)=>{
  //     socket.on('message',({name,message})=>{
    //         io.emit('message',{name,message})
    //     })
    // console.log("user connected");
    // });
    
    
    // const port = process.env.PORT || 4200;
    // const ObjectID = require('mongodb').ObjectID;
    // const MongoClient = require('mongodb').MongoClient;
    // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcsxh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    // client.connect(err => {
      //   const PopularDrinksCollection = client.db('Cocktail_collection').collection("PopularDrinks");
      //   //////////////////////////////////////////////////////Inserting Home page Data///////////////////////////////////////////////////////
      
      
      
      
      
      // });
      // app.listen(port, () => {
        //   console.log(`Example app listening at http://localhost:${port}`)
        // })
        
        
        
  
        
        
        
  
  const app = require('express')()
  const cors = require('cors');
  app.use(cors());
  const server = require('http').createServer(app)
  const io = require('socket.io')(server)
  app.use(bodyParser.json());
  const port=3000;
  
  io.on('connection', socket => {
    socket.on('message', ({ name, message }) => {
      io.emit('message', { name, message })
    })
})

server.listen(port, () => console.log("server running on port:" + port));
