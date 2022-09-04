const express = require("express");
var http = require("http");
const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);


var io = require("socket.io")(server);

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



app.use(express.json());

io.on('connection',(socket)=>{
    
    console.log('connected');
    console.log('connected to '+socket);

      var index=sockets.length;

      
      socket.emit('index', sockets.length); 
      console.log('connected at '+sockets.length);
      sockets.push(socket);
      socket.join('dummy');

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