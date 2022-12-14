const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);


var io = socketio(server);

app.use(cors());
app.use(express.json());


var memberNames={};

var sockets=[];

var sockets;


var removesocket=(socket)=>{
    var temp=[];
    sockets.forEach((e)=>{
        if(e.id!=socket.id){
            temp.push(e);
        }
    });
    sockets=temp;
};

const rooms = io.of("/").adapter.rooms;


io.on('connection',(socket)=>{
    
    console.log('connected');
    console.log('connected to '+socket);

      var index=sockets.length;

      
      socket.emit('index', sockets.length); 
      console.log('connected at '+sockets.length);
      sockets.push(socket);
      socket.join('dummy');


      socket.on('join', async(data)=>{
        
        socket.join(data['room']);

        memberNames[socket.id]=data['user'];

        print('User '+data['user']+' has joined room '+data['room'])
      });

      socket.on('disconnect',async(_)=>{
        removesocket(socket);
        socket.to('dummy').emit('left',{'index':index});
      });

      socket.on('send-offer', async (data)=>{
        socket.to(sockets[data['to']].id).emit('offer-recieved',data);
      });

      socket.on('send-answer',async (data)=>{
        socket.to(sockets[data['to']].id).emit('answer-recieved',data);
      });

      socket.on('add-candidate',async (data)=>{
        socket.to(sockets[data['to']].id).emit('candidate-recieved',data);
      });

});



server.listen(port, "0.0.0.0", () => {
    console.log('Server started and running on port ' + port);
})