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
        let roomid = `${roomObj.userId}-${roomObj.ticker}`
        //console.log('joining room', roomid);
        app.locals.roomMap.set(roomid,arr)
        //socket.join(roomObj.roomid); 
    })
    
    // socket.on('unsubscribeWatchList', function(roomObj) {  
    //     console.log('leaving room', roomObj);
    //     let roomid = `${socket.id}-${roomObj.ticker}`
    //     console.log('leaving room', roomid);
    //     socket.leave(roomid); 
    // })

});

app.use(function(req,res,next){
    req.io = io;
    req.socket = socket
    next();
});

//initialize routes
app.use('/api',routes)

setInterval( async function(){
    //console.log('hello')
    let socketList = io.sockets.server.eio.clients;
    for(const [key, value] of app.locals.roomMap.entries()){
        let socketId = value[2]
        
        if(socketList[socketId] === undefined){
            console.log('socketId disconnected',socketId)

        }else{
            console.log('else',key)
            let ticker = value[0]
            let apiKey = value[1]
           //const response = await tiingoapis.getStockQuote(ticker,apiKey);
           const response = await tiingoapis.dummyGetStockQuote(ticker,apiKey);
            let d = new Date();
            // const response = [ { last: 333 * d.getSeconds(),
            //     bidPrice: null,
            //     quoteTimestamp: '2020-06-08T20:00:00+00:00',
            //     mid: null,
            //     open: 330.25,
            //     timestamp: '2020-06-08T20:00:00+00:00',
            //     tngoLast: 333.46,
            //     lastSize: null,
            //     askSize: null,
            //     ticker: 'AAPL',
            //     askPrice: null,
            //     low: 327.32,
            //     volume: 23913634,
            //     prevClose: 331.5,
            //     bidSize: null,
            //     lastSaleTimestamp: '2020-06-08T20:00:00+00:00',
            //     high: 333.6 } ]
            //console.log(response)
            console.log('type of response', typeof response)
            io.sockets.emit(key, response);
            //io.sockets.in(key).emit(ticker,'response')
        }
    
        
    }
}, 1000);