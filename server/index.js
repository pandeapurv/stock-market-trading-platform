const express = require('express')
const routes = require('./routes/api')
const bodyParser = require('body-parser');
const cors = require('cors')
var socket = require('socket.io');
const tiingoapis = require('./routes/tiingoapi')

//set up express
const app = express()

app.locals.roomMap = new Map()
app.locals.assetMap = new Map()

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
        console.log('subscribeWatchList', socket.id); 
        let roomid = `${roomObj.userId}-${roomObj.ticker}`
        console.log('subscribeWatchList ticker', roomid); 
        //console.log('joining room', roomid);
        app.locals.roomMap.set(roomid,arr)
        //socket.join(roomObj.roomid); 
    })
    
    socket.on('unsubscribeWatchList', function(roomObj) {  
        console.log('unsubscribeWatchList from watchlist');
        let roomid = `${roomObj.userId}-${roomObj.ticker}`
        console.log('leaving room', roomid);
        for(const [key, value] of app.locals.roomMap.entries()){
            console.log('key',key)  
            console.log('value',value)  
        }
        app.locals.roomMap.delete(roomid)
       // socket.leave(roomid); 
       console.log('---------------')
       for(const [key, value] of app.locals.roomMap.entries()){
        console.log('key',key)  
        console.log('value',value)  
    }
    })

    socket.on('subscribeAssetList', function(roomObj) { 

        let arr = [roomObj.ticker, roomObj.apiKey,socket.id]
        console.log('assetMap', socket.id); 
        let roomid = `${roomObj.userId}-${roomObj.ticker}`
        console.log('assetMap ticker', roomid); 
        app.locals.assetMap.set(roomid,arr)
    })

    socket.on('unsubscribeAssetList', function(roomObj) {  
        console.log('unsubscribeAssetList from watchlist');
        let roomid = `${roomObj.userId}-${roomObj.ticker}`
        console.log('leaving room', roomid);
        for(const [key, value] of app.locals.assetMap.entries()){
            console.log('key',key)  
            console.log('value',value)  
        }
        app.locals.assetMap.delete(roomid)
       // socket.leave(roomid); 
       console.log('---------------')
       for(const [key, value] of app.locals.roomMap.entries()){
        console.log('key',key)  
        console.log('value',value)  
    }
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
    //console.log('hello')
    let socketList = io.sockets.server.eio.clients;
    let disabledSocketEvents = []
    for(const [key, value] of app.locals.roomMap.entries()){
        let socketId = value[2]
        
        if(socketList[socketId] === undefined){
            console.log('socketId disconnected',socketId)
            disabledSocketEvents.push(key)

        }else{
            //console.log('else',key)
            let ticker = value[0]
            let apiKey = value[1]
           //const response = await tiingoapis.getStockQuote(ticker,apiKey);
           const response = await tiingoapis.dummyGetStockQuote(ticker,apiKey);
           console.log(ticker)
            io.sockets.emit(key, response);
            //io.sockets.in(key).emit(ticker,'response')
        }    
    }
    disabledSocketEvents.forEach(el => app.locals.roomMap.delete(el))


    //emmit assetlist assetMap
    let disabledAssetSocketEvents = []
    for(const [key, value] of app.locals.assetMap.entries()){
        let socketId = value[2]
        
        if(socketList[socketId] === undefined){
            console.log('socketId disconnected',socketId)
            disabledSocketEvents.push(key)

        }else{
            //console.log('else',key)
            let ticker = value[0]
            let apiKey = value[1]
           //const response = await tiingoapis.getStockQuote(ticker,apiKey);
           const response = await tiingoapis.dummyGetStockQuote(ticker,apiKey);
           console.log('assset',ticker)
            io.sockets.emit(`asset-${key}`, response);
            //io.sockets.in(key).emit(ticker,'response')
        }    
    }
    disabledAssetSocketEvents.forEach(el => app.locals.assetMap.delete(el))
}, 10000);