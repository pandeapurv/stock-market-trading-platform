const express = require('express')
const router = express.Router()
const tiingoapis = require('./tiingoapi')

//get a list of ninjas
router.get('/ninjas/:id',function(req,res){
    console.log(req.params.id)
    console.log('socket',req.socket)
    console.log('io',req.io)
    res.send({type:'GET'})
})

//add a new ninja
router.post('/ninjas',function(req,res){
    console.log(req.body)
    res.send({type:'POST',
            name:req.body.name})
})



//update a ninja
router.put('/ninjas/:id',function(req,res){
    res.send({type:'PUT'})
})

//delete a ninja
router.delete('/ninjas/:id',function(req,res){
    res.send({type:'DELETE'})
})

//TINGO
router.get('/tiingo/stock/quote/:quote/:apiKey', async function(req, res){
    const ticker = req.params.quote
    const apiKey = req.params.apiKey
    const response = await tiingoapis.dummyGetStockQuote(ticker,apiKey);
    console.log('response',response)
    // console.log('socket',req.socket)
    // console.log('io',req.io)
    //res.send({type:'GET'})
    
    /*const response = await tiingoapis.getStockQuote(ticker);
    console.log(typeof response)*/
    
    
    //console.log('resp',resp)
    //let resp2 = resp.json()
    // console.log('resp2',resp2)
    // console.log(typeof resp2)
    // let dataObj =  JSON.parse(resp2.response)
    // console.log('dataObj',dataObj)
    // console.log(typeof dataObj)
    res.send({response:response})
    
})

router.get('/tiingo/stock/historicalquote/:quote/:apiKey/:startDate', async function(req, res){
    const ticker = req.params.quote
    const apiKey = req.params.apiKey
    const startDate = req.params.startDate
    //const response = await tiingoapis.getEODQuote(ticker,apiKey,startDate);
    const response = await tiingoapis.dummyGetHistoricalStockQuote(ticker,apiKey,startDate);
    console.log('historicalquote response',response)
    // console.log('socket',req.socket)
    // console.log('io',req.io)
    //res.send({type:'GET'})
    
    /*const response = await tiingoapis.getStockQuote(ticker);
    console.log(typeof response)*/
    
    
    //console.log('resp',resp)
    //let resp2 = resp.json()
    // console.log('resp2',resp2)
    // console.log(typeof resp2)
    // let dataObj =  JSON.parse(resp2.response)
    // console.log('dataObj',dataObj)
    // console.log(typeof dataObj)
    res.send({response:response})
    
})


router.post('/tiingo/stock/watchlist',function(req,res){
    console.log(req.body)
    res.send({type:'POST',
            name:req.body})
})


// async function getquote(url) {
//     let res = await doRequest(url);
//     console.log(res);
//     return res
//   }

//   function doRequest(ticker) {
//     var requestOptions = {
//         //'url': 'https://api.tiingo.com/iex/?tickers=aapl,spy&token=3215238ddef82cc6fe883b4b9a13abeaa506dc85',
//         'url':`${IEX_REST_API}?tickers=${ticker}&token=${TIINGO_AUTH_ID}`,
//         'headers': {
//             'Content-Type': 'application/json'
//             }
//     };
//     return new Promise(function (resolve, reject) {
//       request(requestOptions, function (error, res, body) {
//         if (!error && res.statusCode == 200) {
//           resolve(body);
//         } else {
//           reject(error);
//         }
//       });
//     });
//   }



module.exports=router