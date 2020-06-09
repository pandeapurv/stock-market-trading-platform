const express = require('express')
const routes = require('./routes/api')
const bodyParser = require('body-parser');
const cors = require('cors')
var socket = require('socket.io');
const tiingoapis = require('./routes/tiingoapi')





//set up express
const app = express()

app.locals.roomMap = new Map()

//listen for request
var server = app.listen(process.env.port ||  5000, function(){
    console.log('now listening on port 5000')
})

//Middleware
app.use(cors())
app.use(bodyParser.json());

var io = socket(server);
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);  
    socket.on('subscribeWatchList', function(roomObj) { 
        
        //map with (room= ticker_socketid, [ticker,apikey])
        let arr = [roomObj.ticker, roomObj.apiKey,socket.id]
        //myMap.set('bla2','blaa2')
        //myMap.delete('bla')
        console.log('made socket connection', socket.id); 
        let roomid = `${socket.id}-${roomObj.ticker}`
        console.log('joining room', roomid);
        app.locals.roomMap.set(roomid,arr)
        socket.join(roomObj.roomid); 
    })
    
    socket.on('unsubscribeWatchList', function(roomObj) {  
        console.log('leaving room', roomObj);
        let roomid = `${socket.id}-${roomObj.ticker}`
        console.log('leaving room', roomid);
        socket.leave(roomid); 
    })

});

app.use(function(req,res,next){
    req.io = io;
    req.socket = socket
    next();
});

//initialize routes
app.use('/api',routes)

setInterval( async function(){
    console.log('hello')
    let socketList = io.sockets.server.eio.clients;
    for(const [key, value] of app.locals.roomMap.entries()){
        let socketId = value[2]
        
        if(socketList[socketId] === undefined){
            console.log('socketId disconnected',socketId)

        }else{
            console.log(socketId)
            // let ticker = value[0]
            // let apiKey = value[1]
            // //const response = await tiingoapis.getStockQuote(ticker,apiKey);
            // //console.log(response)
            // io.sockets.in(key).emit(ticker,'response')
        }
    
        
    }
}, 1000);