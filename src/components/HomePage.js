import React, { useContext, useState, useEffect, useRef }  from 'react';
import { UserContext } from '../contexts/UserContext'
import Watchlist from './WatchList'
import io from "socket.io-client";

const HomePage = () => {
    const {user, dispatch  } = useContext(UserContext);
    const userRef = useRef(user);
    const [serverTime, setServerTime] = useState([]);
    const [quote, setQuote] = useState([])

    React.useEffect(() => {
        userRef.current = user;
    });

    

    //EURUSD
    useEffect( () => {
        // async function fetchData() {
        //     console.log('hello')
        //     let response = await fetch('http://localhost:5000/api/tiingo/stock/quote/aapl')
        //     let res = await response.json()
        //     //let dataObj =  JSON.parse(res.response)
           
        //     console.log(res.response[0].last)
        // }
        // fetchData();

        
        let { watchList, userName, apiKey,watchlistDetails,id, socket } =  userRef.current

        

        watchList.forEach(
            ticker => 
            socket.emit('subscribeWatchList', {
                ticker,
                userName,
                apiKey,
                userId : userRef.current.id
            }));

        //dispatch({ type: 'UPDATEWATCHLIST', user: { watchList, }});
            //console.log('watchlist lsit',watchList)
        // watchList.forEach(
        //     ticker =>
        // socket.on(`${id}-${ticker}`, function(data){
        //     let { watchList, userName, apiKey,watchlistDetails,id, socket } =  userRef.current
        //     let watchlistDetail = new Object();
        //     watchlistDetail.symbol = data[0].ticker
        //     watchlistDetail.price = data[0].last.toFixed(2)
        //     watchlistDetail.low = data[0].low.toFixed(2)
        //     watchlistDetail.high = data[0].high.toFixed(2)
        //     watchlistDetail.volume = data[0].volume.toFixed(2)
        //     watchlistDetail.daygain = ((watchlistDetail.price - data[0].prevClose)/ watchlistDetail.price) * 100
        //     watchlistDetail.daygain= watchlistDetail.daygain.toFixed(2);
        //     const found = watchlistDetails.some(el => el.symbol === watchlistDetail.symbol);

        //     if(found){
        //         dispatch({ type: 'UPDATEWATCHLISTDETAILS', user: { watchlistDetail,  }});
        //     }else{
        //         dispatch({ type: 'ADDTOWATCHLISTDETAILS', user: { watchlistDetail, }});
        //     }
        // }))
        
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
       
        // if(user.connectSockt){
        //     console.log('useEffext')
        //     user.socket.on("timer", users => {
        //         setServerTime(users);
        //     }); 
        //     user.socket.emit('subscribeToTimer', 1000);
        //     dispatch({ type: 'TOGGLESOCKETSUB', user: { connectSockt:false }});
        // }
       
      }, []);



     
    return ( 
           
            <React.Fragment>
<header>
        <div className="container container-nav">
            <div className="nav-account-info">
                <nav>
                    <ul className="nav-account-info-ul">
                        <li className="nav-account-info-li">
                            <div className="nav-account-info-title">Account Value{serverTime}</div>
                            <div className="nav-account-info-val">$18884.49</div>                           
                        </li>
                        <li className="nav-account-info-li">
                            <div className="nav-account-info-title">Total cash </div>
                            <div className="nav-account-info-val">$1149.29</div>
                        </li>
                        <li className="nav-account-info-li">
                            <div className="nav-account-info-title">Positions</div>
                            <div className="nav-account-info-val">$735.20</div>
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
        <div className="main-info-details">
            <div className="getquote">Get quote
            
            </div>
            <div className="quotedetails">quotedetails</div>
            <div className="chart-container">chart</div>
        </div>
        
    </div>
    </React.Fragment>
     );
}
 
export default HomePage;