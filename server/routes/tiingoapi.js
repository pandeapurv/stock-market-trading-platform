var request = require('request');
const { TIINGO_AUTH_ID, IEX_REST_API } = require('../configurations/index')

module.exports = {
    getStockQuote: function(ticker,apiKey){
        var requestOptions = {
            'url':`${IEX_REST_API}?tickers=${ticker}&token=${apiKey}`,
            'headers': {
                'Content-Type': 'application/json'
                }
        };
        

        return new Promise(function (resolve, reject) {
            request(requestOptions, function (error, res, body) {
              if (!error && res.statusCode == 200) {
                console.log(typeof body)
                //let bres = body.json()
                resolve(JSON.parse(body));
              } else {
                reject(error);
              }
            });
          });

        
    },

    dummyGetStockQuote : function(ticker,apiKey){
      let d = new Date();
        let DummyStockQuotes = {
          AAPL: [ { last: 333 * d.getSeconds(),
            bidPrice: null,
            quoteTimestamp: '2020-06-08T20:00:00+00:00',
            mid: null,
            open: 330.25,
            timestamp: '2020-06-08T20:00:00+00:00',
            tngoLast: 333.46,
            lastSize: null,
            askSize: null,
            ticker: 'AAPL',
            askPrice: null,
            low: 327.32,
            volume: 23913634,
            prevClose: 331.5,
            bidSize: null,
            lastSaleTimestamp: '2020-06-08T20:00:00+00:00',
            high: 333.6 } ],

            AMZN: [ { last: 2200 * d.getSeconds(),
              bidPrice: null,
              quoteTimestamp: '2020-06-08T20:00:00+00:00',
              mid: null,
              open: 2200.25,
              timestamp: '2020-06-08T20:00:00+00:00',
              tngoLast: 333.46,
              lastSize: null,
              askSize: null,
              ticker: 'AMZN',
              askPrice: null,
              low: 327.32,
              volume: 239136334,
              prevClose: 331.5,
              bidSize: null,
              lastSaleTimestamp: '2020-06-08T20:00:00+00:00',
              high: 333.6 } ],
            
              TSLA: [ { last: 900 * d.getSeconds(),
                bidPrice: null,
                quoteTimestamp: '2020-06-08T20:00:00+00:00',
                mid: null,
                open: 900.25,
                timestamp: '2020-06-08T20:00:00+00:00',
                tngoLast: 333.46,
                lastSize: null,
                askSize: null,
                ticker: 'TSLA',
                askPrice: null,
                low: 327.32,
                volume: 23913634,
                prevClose: 331.5,
                bidSize: null,
                lastSaleTimestamp: '2020-06-08T20:00:00+00:00',
                high: 980.6 } ],
        
        }

        return new Promise((resolve, reject) =>{
          resolve(DummyStockQuotes[ticker])
        })
    }

    
}