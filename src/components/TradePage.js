import React, { useContext, useState, useEffect, useRef }  from 'react';
import { UserContext } from '../contexts/UserContext'

//{symbol, price}
const TradePage = (props) => {

    const [tradeQty, setTradeQty] = useState(props.tradeQty)
    const [symbol,setSymbol] = useState(props.symbol)
    const [stockPrice, setStockPrice] = useState(props.price)


    const {user, dispatch  } = useContext(UserContext);

    const userRef = useRef(user);

    React.useEffect(() => {
        userRef.current = user;
    });

    

    const buyStock = async () => {
        // get realtime price and buy
        let { apiKey, totalCash } =  userRef.current
        let response = await fetch(`http://localhost:5000/api/tiingo/stock/quote/${symbol}/${apiKey}`)
        let res = await response.json()
        console.log(res.response[0])
        if((res.response[0].last *tradeQty) < totalCash){
            let { watchList, userName, apiKey,watchlistDetails,id, socket,assetWatchList, assetDetails } =  userRef.current
            dispatch({ type: 'UPDATECASH', user: { 
                cash : totalCash - res.response[0].last *tradeQty}});
            if(!assetWatchList.includes(symbol)){
                
                assetWatchList.push(symbol)
                dispatch({ type: 'UPDATEASSETWATCHLIST', user: { 
                    assetWatchList,}});

                let assetlistDetail = new Object();
                assetlistDetail.symbol = symbol
                assetlistDetail.quantity = tradeQty
                assetlistDetail.buyingPrice=res.response[0].last.toFixed(2)
                assetlistDetail.marketValue = res.response[0].last *tradeQty
                assetlistDetail.marketValue = assetlistDetail.marketValue.toFixed(2)
                assetDetails.push(assetlistDetail)
                dispatch({ type: 'ADDTOASSETDETAILS', user: { assetDetails,  }});

                                
                socket.emit('subscribeAssetList', {
                    ticker: symbol,
                    userName,
                    apiKey,
                    userId : user.id
                })
            }else{
                const found = assetDetails.some(el => el.symbol === symbol);
                if(found){

                    socket.emit('unSubscribeAssetList', {
                        ticker: symbol,
                        userName,
                        apiKey,
                        userId : user.id
                    })

                    let assetDetail = new Object();
                    assetDetail.buyingPrice = res.response[0].last.toFixed(2)
                    assetDetail.symbol = symbol
                    assetDetail.qty = tradeQty
                    
                    dispatch({ type: 'UPDATEASSETDETAILS', user: { assetDetail,  }});

                    socket.emit('subscribeAssetList', {
                        ticker: symbol,
                        userName,
                        apiKey,
                        userId : user.id
                    })


                }else{
                    let assetlistDetail = new Object();
                    assetlistDetail.symbol = symbol
                    assetlistDetail.quantity = tradeQty
                    assetlistDetail.buyingPrice=res.response[0].last.toFixed(2)
                    assetlistDetail.marketValue = res.response[0].last *tradeQty
                    assetlistDetail.marketValue = assetlistDetail.marketValue.toFixed(2)
                    assetDetails.push(assetlistDetail)
                    dispatch({ type: 'ADDTOASSETDETAILS', user: { assetDetails,  }});
                }
            } 
            
            console.log('heyia')
            props.redirectToPortfolio()
        }else{
            setStockPrice(res.response[0].last.toFixed(2))
        }
    }

    return ( 
        <div>
 
           <div className="trade-div">
                <table className="trade-table">
                    <thead>
                        <tr>
                        <td>Symbol</td>
                        <td>Market Price</td>                        
                        <td>Quantity</td>
                        <td>Trade Value</td>
                        <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={symbol}>
                            <td>{symbol}</td>
                            <td>{stockPrice}</td>
                            <td><input type="text" className="watchlist-form-input" 
                            required placeholder="quantity"
                    value={tradeQty} onChange ={(e) => (setTradeQty(e.target.value))} /></td>
                            <td>{(stockPrice*tradeQty).toFixed(2)}</td>
                            <td>
                            <button className="watchlist-form-btn" 
                            disabled={userRef.current.totalCash < stockPrice*tradeQty}
                            onClick={() => buyStock()}
                            >Buy</button>
                            <span>/</span>
                            <button className="watchlist-form-btn" 
                            disabled = {!userRef.current.assetWatchList.some(
                                el => el.symbol === symbol)}
                                onClick={() => buyStock()}
                            >Sell</button>
                            </td>
                        </tr>
                        
                    </tbody>
                    </table>
           </div>
           {/* </form> */}
            
        </div>
     );
}
 
export default TradePage;