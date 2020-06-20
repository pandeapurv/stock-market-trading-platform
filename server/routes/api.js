const express = require('express')
const router = express.Router()
const tiingoapis = require('./tiingoapi')



//TINGO
router.get('/tiingo/stock/quote/:quote/:apiKey', async function(req, res){
    const ticker = req.params.quote
    const apiKey = req.params.apiKey
    //const response = await tiingoapis.dummyGetStockQuote(ticker,apiKey);
    const response = await tiingoapis.getStockQuote(ticker,apiKey);
    console.log('response',response)
    if(response.detail === undefined){
        res.send({response:response})
    }else{
        res.send({response:response, error: response.detail})
    }
    
})

router.get('/tiingo/stock/historicalquote/:quote/:apiKey/:startDate', async function(req, res){
    const ticker = req.params.quote
    const apiKey = req.params.apiKey
    const startDate = req.params.startDate
    //const response = await tiingoapis.getEODQuote(ticker,apiKey,startDate);
    const response = await tiingoapis.dummyGetHistoricalStockQuote(ticker,apiKey,startDate);
    console.log('historicalquote response',response)

    if(response.detail === undefined){
        res.send({response:response})
    }else{
        res.send({response:response, error: response.detail})
    }
    
})


router.get('/tiingo/stock/historicalquote/oneday/:quote/:apiKey/:startDate', async function(req, res){
    const ticker = req.params.quote
    const apiKey = req.params.apiKey
    const startDate = req.params.startDate
    //const response = await tiingoapis.getEODQuote(ticker,apiKey,startDate);
    //const response = await tiingoapis.dummyGetOneDayQuote(ticker,apiKey,startDate);
    const response = await tiingoapis.getOneDayQuote(ticker,apiKey,startDate);
    console.log('historicalquote response',response)
    if(response.detail === undefined){
        res.send({response:response})
    }else{
        res.send({response:response, error: response.detail})
    }
   
    
})

router.get('/tiingo/stock/historicalquote/fivedays/:quote/:apiKey/:startDate', async function(req, res){
    const ticker = req.params.quote
    const apiKey = req.params.apiKey
    const startDate = req.params.startDate
    const response = await tiingoapis.getXDayQuote(ticker,apiKey,startDate);
    //const response = await tiingoapis.dummyGetFiveDayQuote(ticker,apiKey,startDate);
    console.log('historicalquote response',response)

    if(response.detail === undefined){
        res.send({response:response})
    }else{
        res.send({response:response, error: response.detail})
    }
    
})


router.get('/tiingo/stock/historicalquote/onemonth/:quote/:apiKey/:startDate', async function(req, res){
    const ticker = req.params.quote
    const apiKey = req.params.apiKey
    const startDate = req.params.startDate
    //const response = await tiingoapis.getEODQuote(ticker,apiKey,startDate);
    const response = await tiingoapis.getXDayQuote(ticker,apiKey,startDate);
    //const response = await tiingoapis.dummyGetOneMonthQuote(ticker,apiKey,startDate);
    console.log('historicalquote response',response)

   
    if(response.detail === undefined){
        res.send({response:response})
    }else{
        res.send({response:response, error: response.detail})
    }
    
})


router.get('/tiingo/stock/historicalquote/sixmonths/:quote/:apiKey/:startDate', async function(req, res){
    const ticker = req.params.quote
    const apiKey = req.params.apiKey
    const startDate = req.params.startDate
    //const response = await tiingoapis.getEODQuote(ticker,apiKey,startDate);
    const response = await tiingoapis.getXDayQuote(ticker,apiKey,startDate);
    //const response = await tiingoapis.dummyGetSixMonthsQuote(ticker,apiKey,startDate);
    console.log('historicalquote response',response)

    if(response.detail === undefined){
        res.send({response:response})
    }else{
        res.send({response:response, error: response.detail})
    }
    
})


router.get('/tiingo/stock/historicalquote/oneyear/:quote/:apiKey/:startDate', async function(req, res){
    const ticker = req.params.quote
    const apiKey = req.params.apiKey
    const startDate = req.params.startDate
    //const response = await tiingoapis.getEODQuote(ticker,apiKey,startDate);
    const response = await tiingoapis.getXDayQuote(ticker,apiKey,startDate);
    //const response = await tiingoapis.dummyGetOneYearQuote(ticker,apiKey,startDate);
    console.log('historicalquote response',response)

    if(response.detail === undefined){
        res.send({response:response})
    }else{
        res.send({response:response, error: response.detail})
    }
    
})



router.post('/tiingo/stock/watchlist',function(req,res){
    console.log(req.body)
    res.send({type:'POST',
            name:req.body})
})






module.exports=router