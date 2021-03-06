import { v4 as uuidv4 } from 'uuid';

export const userDetailsReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isAuthenticated: true,
                connectSockt: true, 
                userName : action.user.userName,
                apiKey : action.user.apiKey,
                socket : action.user.socket,
                watchList : action.user.watchList,              
                id : uuidv4(),
                watchlistDetails : [],
                totalCash: action.user.accValue,
                assetWatchList : [],
                assetDetails : []

            }
        case 'TOGGLESOCKETSUB' :
            return {...state,
                connectSockt:false
            }
        case 'ADDTOWATCHLIST' :
            //console.log('addtowatchlist')
            //https://github.com/facebook/react/issues/16295 ??
            if(state.watchList.includes(action.user.watchListTicker)){
                //console.log("already present")
                return {
                    ...state
                }
            }
            console.log('addtowatchlist after')
            return {
                ...state,
                watchList : [...state.watchList, action.user.watchListTicker], 
            }
        
        case 'REMOVEFROMWATCHLIST' :
            return {
                ...state,
                watchList : state.watchList.filter(el => el !== action.user.watchListTicker)
            }
        case 'ADDTOWATCHLISTDETAILS' :
            //console.log('inside add to watchlist')
            return {
                ...state,
                watchlistDetails :  action.user.watchlistDetails,
            }
        case 'UPDATECASH' : 
            return {
                ...state,
                totalCash : action.user.cash
            }
        case 'UPDATEWATCHLISTDETAILS' :
            return {
                ...state,
                
                watchlistDetails : 
                state.watchlistDetails.map(el => (el.symbol ===  action.user.watchlistDetail.symbol 
                         ? Object.assign({}, {
                            symbol : action.user.watchlistDetail.symbol,
                            price : action.user.watchlistDetail.price,
                            low : action.user.watchlistDetail.low,
                            high : action.user.watchlistDetail.high,
                            volume : action.user.watchlistDetail.volume,
                            daygain : action.user.watchlistDetail.daygain
                         })
                         : el ))
            }
        case 'REMOVEFROMWATCHLISTDETAILS' :
            console.log('REMOVEFROMWATCHLISTDETAILS',action.user.watchlistDetailTicker)
            return {
                ...state,
                watchlistDetails : state.watchlistDetails.filter(el => el.symbol !== action.user.watchlistDetailTicker)
            }

            /**asset actions*/
        case 'UPDATEASSETWATCHLIST' :
            return {
                ...state,
                assetWatchList : action.user.assetWatchList,
            }

        // case 'REMOVEFROMASSETWATCHLIST' :
        // console.log('REMOVEFROMASSETWATCHLIST',action.user.watchlistDetailTicker)
        // return {
        //     ...state,
        //     assetWatchList : state.assetWatchList.filter(el => el.symbol !== action.user.watchlistDetailTicker)
        // }
        
        case 'ADDTOASSETDETAILS' : 
            return {
                ...state,
                assetDetails : action.user.assetDetails
            }
        
        case 'UPDATEASSETDETAILS' : 
            return {
                ...state,
                assetDetails : state.assetDetails.map (el => (el.symbol ===  action.user.assetDetail.symbol 
                ? Object.assign({}, {
                    symbol: action.user.assetDetail.symbol,
                    buyingPrice: ((Number(el.buyingPrice) * Number(el.quantity) + 
                        Number(action.user.assetDetail.buyingPrice) * Number(action.user.assetDetail.qty)) / 
                    (Number(el.quantity) + Number(action.user.assetDetail.qty))).toFixed(2),
                    quantity: Number(el.quantity) + Number(action.user.assetDetail.qty),                    
                    marketValue: (Number(el.marketValue) + Number(action.user.assetDetail.qty) * Number(action.user.assetDetail.buyingPrice)).toFixed(2), 
                })
                : el
                ))
            }
        
        case 'UPDATESELLASSETDETAILS' : 
            return {
                ...state,
                assetDetails : state.assetDetails.map (el => (el.symbol ===  action.user.assetDetail.symbol 
                ? Object.assign({}, {
                    symbol: action.user.assetDetail.symbol,
                    buyingPrice: el.buyingPrice,
                    marketValue: action.user.assetDetail.marketValue.toFixed(2), 
                    quantity: Number(action.user.assetDetail.qty),                                
                })
                : el
                ))
            }

            case 'UPDATEASSETPRICEDETAILS' : 
            return {
                ...state,
                assetDetails : state.assetDetails.map (el => (el.symbol ===  action.user.assetDetail.symbol 
                ? Object.assign({}, {
                    symbol: action.user.assetDetail.symbol,
                    buyingPrice: Number(el.buyingPrice).toFixed(2) ,
                    quantity: Number(el.quantity) ,                    
                    marketValue: (Number(el.quantity) * Number(action.user.assetDetail.currPrice)).toFixed(2), 
                })
                : el
                ))
            }
        default:
            return state
    }
}
 


/*
watchlistDetails : [
    {
        "symbol" : 'aapl',
        "price" : 300,
        "low" : 200,
        "high" : 350,
        "volume" : 1213232,
        "daygain" : '1%'
    },
    {
        "symbol" : 'amzn',
        "price" : 400,
        "low" : 410,
        "high" : 450,
        "volume" : 12132332,
        "daygain" : '21%'
    }
]
*/

/*
assets : [
    {
        symbol:
        quantity:
        buyingPrice:
        marketValue:
    }
]
*/