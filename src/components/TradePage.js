import React, { useContext, useState, useEffect, useRef }  from 'react';
import { UserContext } from '../contexts/UserContext'

//{symbol, price}
const TradePage = (props) => {

    const [tradeQty, setTradeQty] = useState(props.tradeQty)
    const [symbol,setSymbol] = useState(props.symbol)
    const [stockPrice, setStockPrice] = useState(props.price)
    const [sellableQty, setSellableQty ] =useState(0)

    const {user, dispatch  } = useContext(UserContext);

    const userRef = useRef(user);

    React.useEffect(() => {
        userRef.current = user;
        
    });

    useEffect(() => {
        let { assetWatchList, assetDetails } =  userRef.current
        if(assetWatchList.includes(symbol)){
            let assetList = assetDetails.filter(el => el.symbol === symbol)
            console.log('assetList',assetList)
            let asset = assetList[0]
            console.log('asset',asset)
            if(typeof asset !== 'undefined'){
                console.log('hello from sell')
                setSellableQty(asset.quantity)
            }
            
        }else{
            setSellableQty(0)
        }

    },[])

    

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

    const sellStock = async () => {

        let { totalCash,watchList, userName, apiKey,watchlistDetails,id, socket,assetWatchList, assetDetails } =  userRef.current
        
        let response = await fetch(`http://localhost:5000/api/tiingo/stock/quote/${symbol}/${apiKey}`)
        let res = await response.json()
        console.log(res.response[0])

        socket.emit('unsubscribeAssetList', {
            ticker: symbol,
            userName,
            apiKey,
            userId : user.id
        })

        dispatch({ type: 'UPDATECASH', user: { 
            cash : totalCash + res.response[0].last *tradeQty}});


        let assetList = assetDetails.filter(el => el.symbol === symbol)
        let asset = assetList[0]
        if(Number(asset.quantity) > Number(tradeQty)){
            let assetDetail = new Object();
            assetDetail.currPrice = res.response[0].last.toFixed(2)
            assetDetail.symbol = symbol
            assetDetail.qty = Number(asset.quantity) - Number(tradeQty)
            assetDetail.marketValue = (Number(asset.quantity) - Number(tradeQty))* res.response[0].last.toFixed(2)

            dispatch({ type: 'UPDATESELLASSETDETAILS', user: { assetDetail,  }});
            socket.emit('subscribeAssetList', {
                ticker: symbol,
                userName,
                apiKey,
                userId : user.id
            })
        }else{
            let assetDetailsList = assetDetails.filter(el => el.symbol !== symbol)
            //assetDetails.push(assetlistDetail)
            console.log('pandey',assetWatchList)
            console.log('sdlnfsapurv',symbol)
            let assetList = assetWatchList.filter(el => el !== symbol)
            console.log('ewfedksjfskdf',assetList)
            dispatch({ type: 'ADDTOASSETDETAILS', user: { assetDetails:assetDetailsList,  }});
            
            dispatch({ type: 'UPDATEASSETWATCHLIST', user: { assetWatchList:assetList,  }});
            
           
        }

        props.redirectToPortfolio()

       
        


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
                            <td>{Number(stockPrice).toFixed(2)}</td>
                            <td><input type="text" className="watchlist-form-input" 
                            required placeholder="quantity"
                    value={tradeQty} onChange ={(e) => (setTradeQty(e.target.value))} /></td>
                            <td>{(stockPrice*tradeQty).toFixed(2)}</td>
                            <td>
                            <button className="watchlist-form-btn" 
                            disabled={userRef.current.totalCash < stockPrice*tradeQty && tradeQty > 0}
                            onClick={() => buyStock()}
                            >Buy</button>
                            <span>/</span>
                            <button className="watchlist-form-btn" 
                            disabled = {sellableQty <  tradeQty && tradeQty > 0 }
                                onClick={() => sellStock()}
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