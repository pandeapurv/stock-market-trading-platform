import React, { useContext, useState, useEffect }  from 'react';
import { UserContext } from '../contexts/UserContext'
const HomePage = () => {
    const {user, dispatch  } = useContext(UserContext);
    const { watchList, socket, userName, apiKey,watchlistDetails } = user
    const [serverTime, setServerTime] = useState([]);
    const [quote, setQuote] = useState([])
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

        watchList.forEach(
            ticker => socket.on(ticker, function(data){
                console.log('ticker',ticker)
                console.log('response',data)
            })
        )
        
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
        </div>
        <div className="main-info-details">
            <div className="getquote">Get quote</div>
            <div className="quotedetails">quotedetails</div>
            <div className="chart-container">chart</div>
        </div>
        
    </div>
    </React.Fragment>
     );
}
 
export default HomePage;