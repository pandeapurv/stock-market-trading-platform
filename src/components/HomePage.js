import React, { useContext, useState, useEffect, useRef }  from 'react';
import { UserContext } from '../contexts/UserContext'
import Watchlist from './WatchList'
import io from "socket.io-client";
import TradePage from './TradePage'
import PortfolioPage from './PortfolioPage'
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'
import {ProtectedRoute} from './ProtectedRoute'

const HomePage = (props) => {
    const {user, dispatch  } = useContext(UserContext);
    const userRef = useRef(user);
    const [serverTime, setServerTime] = useState([]);
    const [getQuoteTicker, setGetQuoteTicker] = useState('')
    const [quote, setQuote] = useState([])
    const [showTradePage, setShowTradePage] = useState(false)
    const [showPortFolioPage, setShowPortFolioPage] = useState(false)
    const [getQuoteDetails ,setGetQuoteDetails] = useState({})
    const [showQuoteDetails, setShowQuoteDetails] = useState(false)
    const [shareValue , setShareValue] = useState(0)
    const [tradeSymbo, setTradeSymbo] =useState('')
    const [tradeQty,setTradeQty] = useState(1)
    const [tradePrice,setTradePrice] = useState(0)
    React.useEffect(() => {
        userRef.current = user;
        let stockval = 0
        userRef.current.assetDetails.forEach(
            el => {
                stockval += el.quantity * el.marketValue
            }
        )
        setShareValue(stockval)
    });

    useEffect( () => {
        console.log('heelo from assetwatch',userRef.current.assetWatchList)
        let { watchList, userName, apiKey,watchlistDetails,id, socket
        , assetWatchList,assetDetails } =  userRef.current
        assetWatchList.forEach(
            ticker => 
            socket.on(`asset-${id}-${ticker}`, function(data){
                    let { watchList, userName, apiKey,watchlistDetails,id, socket } =  userRef.current
                    //console.log('inside socket')
                    let assetDetail = new Object();
                    assetDetail.currPrice = data[0].last.toFixed(2)
                    assetDetail.symbol = ticker
                    dispatch({ type: 'UPDATEASSETDETAILS', user: { assetDetail,  }});

                })
            )
    },[userRef.current.assetWatchList.length])

    //EURUSD
    useEffect( () => {     
        let { watchList, userName, apiKey,watchlistDetails,id, socket } =  userRef.current
        watchList.forEach(
            ticker => 
            socket.emit('subscribeWatchList', {
                ticker,
                userName,
                apiKey,
                userId : userRef.current.id
            }));
       
        return function cleanup() {
            console.log('cleanup')
            watchList.forEach(
                ticker => 
                socket.emit('unsubscribeWatchList', {
                    ticker,
                    userName,
                    apiKey,
                }));
            socket.close()
        }      
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();
        let { apiKey } =  userRef.current
        console.log('getQuoteTicker',getQuoteTicker)
        setShowQuoteDetails(false)
        let response = await fetch(`http://localhost:5000/api/tiingo/stock/quote/${getQuoteTicker}/${apiKey}`)
        let res = await response.json()
        console.log(res.response[0])
        console.log(res.response[0].last)
        setGetQuoteDetails({
            symbol :res.response[0].ticker,
            price :res.response[0].last.toFixed(2),
            open :res.response[0].open.toFixed(2),
            low:res.response[0].low.toFixed(2),
            high:res.response[0].high.toFixed(2),
            volume:res.response[0].volume,
            prevClose:res.response[0].prevClose.toFixed(2),
            changepercent : (((res.response[0].last.toFixed(2)-res.response[0].prevClose.toFixed(2))/res.response[0].prevClose.toFixed(2)) * 100).toFixed(2)
        })
        
        setTradeSymbo(getQuoteTicker)
        setTradeQty(1)
        setTradePrice(res.response[0].last.toFixed(2))
        setShowQuoteDetails(true)
    }

    const addToWatchList = () => {
        console.log(getQuoteDetails.symbol)
        let { watchList, userName, apiKey,watchlistDetails,id, socket } =  userRef.current
        dispatch({ type: 'ADDTOWATCHLIST', user: { watchListTicker:getQuoteDetails.symbol,}});
        socket.emit('subscribeWatchList', {
            ticker: getQuoteDetails.symbol,
            userName,
            apiKey,
            userId : user.id
        })
        //console.log('props',props)
        //props.history.push('/home/trade')
    }

    const redirectToPortfolio = () => {
        console.log('inside redirectToPortfolio')
        //props.history.push('/home/portfolio')
        setShowTradePage(false)
        setShowPortFolioPage(true)

    }

    const trade = (symbol, price, quantity) => {
        setShowTradePage(true)
        setShowPortFolioPage(false)
        
        setTradeSymbo(symbol)
        setTradeQty(quantity)
        setTradePrice(price)

    }



    const tradeStock = () => {
        setShowTradePage(true)
        setShowPortFolioPage(false)
    }
     
    return ( 
           
            <React.Fragment>
<header>
        <div className="container container-nav">
            <div className="nav-account-info">
                <nav>
                    <ul className="nav-account-info-ul">
                        <li className="nav-account-info-li">
                            <div className="nav-account-info-title">Account Value</div>
                            <div className="nav-account-info-val">${userRef.current.totalCash + shareValue}</div>                           
                        </li>
                        <li className="nav-account-info-li">
                            <div className="nav-account-info-title">Total cash </div>
                            <div className="nav-account-info-val">${userRef.current.totalCash}</div>
                        </li>
                        <li className="nav-account-info-li">
                            <div className="nav-account-info-title">Positions</div>
                            <div className="nav-account-info-val">${shareValue}</div>
                        </li>
                    </ul>
                </nav>
            </div>
            <div>
                <nav className="nav-tabs">
                    <ul className="nav-tabs-ul">
                        <li className="nav-tabs-li">Home</li>
                        <li className="nav-tabs-li">Portfolio</li>
                        <li className="nav-tabs-li">Settings</li>
                    </ul>
                    </nav>
            </div>
                
            
        </div>
    </header>
    <div className="container main-info">
        <div className="watchlist">
                <h1>watchlist</h1>
                <Watchlist/>
        </div>
        {showTradePage && 
        <div className="main-info-details">
        <TradePage symbol={tradeSymbo} 
        price={tradePrice}
        tradeQty = {tradeQty}
        redirectToPortfolio= {redirectToPortfolio}/>
        </div>
        }


        {showPortFolioPage && 
        <div className="main-info-details">
        <PortfolioPage symbol={getQuoteTicker} 
        price={getQuoteDetails.price}
        tradeStock= {tradeStock}/>
        </div>
        }


        {!showTradePage && !showPortFolioPage &&<div className="main-info-details">
            <div className="getquote">
                <form className="watchlist-form"
                    onSubmit={handleSubmit} >
                    <input type="text" className="watchlist-form-input" required placeholder="Symbol"
                     value={getQuoteTicker}
                     onChange ={(e) => (setGetQuoteTicker(e.target.value))}   />
                    <button className="watchlist-form-btn" type="submit">Get Quote</button>
                </form>
            </div>
           {showQuoteDetails && <div className="quotedetails">
                <div className="subquotedetails">
                    <div className="quotedetails-symbol">{getQuoteDetails.symbol} 
                        <button className="getquote-form-btn"
                        onClick={() => tradeStock()} >Trade</button>
                    </div>
                    <div className="quotedetails-btn">
                    <button className="getquote-form-btn" 
                        onClick={() => addToWatchList()} >
                        {/* <Link to={`${match.url}/props-v-state`}>Add to watch list</Link> */}
                        {/* <Link to="/home/trade"> */}
                        Add to watch list
                        {/* </Link> */}
                    </button></div>
                    <div className="quotedetails-lprice">{getQuoteDetails.price}</div>
                    <div className="quotedetails-change">{getQuoteDetails.changepercent} %</div>
                    <div className="quotedetails-open">Open: {getQuoteDetails.open}</div>
                    <div className="quotedetails-close">Previous Close: {getQuoteDetails.prevClose}</div>
                </div>
            </div>}
            
            {showQuoteDetails && <div className="chart-container">chart</div>}
        </div>}
        
    </div>

    {/* <Switch>                        
        <Route path="/home/trade" component={TradePage} />
    </Switch>  */}
    
    </React.Fragment>
     );
}
 
export default HomePage;