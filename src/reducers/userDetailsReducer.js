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
                watchlistDetails : []
            }
        case 'TOGGLESOCKETSUB' :
            return {...state,
                connectSockt:false
            }
        case 'ADDTOWATCHLIST' :
            console.log('addtowatchlist')
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
                watchlistDetails : [...state.watchlistDetails , action.user.watchlistDetail]
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
            return {
                ...state,
                watchlistDetails : state.watchlistDetails.filter(el => el.symbol !== action.user.watchlistDetail.symbol)
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