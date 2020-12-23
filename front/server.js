const app =require('../first-p/app.js')
const PORT=5001 
const express=require('express');
const rout=express.Router();
const http =require('http');
const socketIO = require('socket.io');


app.set('port', PORT)

const server = http.createServer(app);

const io = require('socket.io')(server, {
cors: {origin: "*"
    }})



const users ={}


io.on('connection', socket => {
  socket.on('online-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })


  socket.on('typing', function(name){
    socket.broadcast.emit('typing', name)
  })

  socket.on('send-chat-message', data => {
   
    socket.broadcast.emit('chat-message', { id: socket.id, message: data.message, name: data.showname })
  })

})


rout.get('/online', async(req,resp)=>{
    
  resp.json(users)
       
  })

app.use('/', rout)



server.listen(PORT, 'localhost')