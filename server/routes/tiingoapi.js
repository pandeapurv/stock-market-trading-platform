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

        
    }

    
}