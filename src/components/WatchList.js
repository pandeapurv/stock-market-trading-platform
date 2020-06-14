import React, { useContext, useState, useEffect,useRef }  from 'react';
import { UserContext } from '../contexts/UserContext'

const Watchlist = () => {

    const {user, dispatch  } = useContext(UserContext);

    const [addSymbol, setAddSymbol] = useState('')
    const userRef = useRef(user);

    React.useEffect(() => {
        userRef.current = user;
    });

    useEffect( () => {
        let { watchList, userName, apiKey,watchlistDetails,id, socket } =  userRef.current
        watchList.forEach(
            ticker =>
        socket.on(`${id}-${ticker}`, function(data){
            let { watchList, userName, apiKey,watchlistDetails,id, socket } =  userRef.current
            let watchlistDetail = new Object();
            watchlistDetail.symbol = data[0].ticker
            watchlistDetail.price = data[0].last.toFixed(2)
            watchlistDetail.low = data[0].low.toFixed(2)
            watchlistDetail.high = data[0].high.toFixed(2)
            watchlistDetail.volume = data[0].volume
            watchlistDetail.daygain = ((data[0].last - data[0].prevClose)/ data[0].prevClose) * 100
            watchlistDetail.daygain= watchlistDetail.daygain.toFixed(2);
            const found = watchlistDetails.some(el => el.symbol === watchlistDetail.symbol);

            if(found){
                dispatch({ type: 'UPDATEWATCHLISTDETAILS', user: { watchlistDetail,  }});
            }else{
                watchlistDetails.push(watchlistDetail)
                dispatch({ type: 'ADDTOWATCHLISTDETAILS', user: { watchlistDetails, }});
            }
        }))
    },[userRef.current.watchList])



    const handleSubmit = (e) => {
        e.preventDefault();
        let { watchList, userName, apiKey,watchlistDetails,id, socket } =  userRef.current
        console.log('handle submit')
        dispatch({ type: 'ADDTOWATCHLIST', user: { watchListTicker:addSymbol,}});
        socket.emit('subscribeWatchList', {
            ticker: addSymbol,
            userName,
            apiKey,
            userId : user.id
        })
       
    }

    const removeSymbol = (symbol,e) => {
        console.log(symbol)
        dispatch({ type: 'REMOVEFROMWATCHLIST', user: { watchListTicker:symbol,}});
        dispatch({ type: 'REMOVEFROMWATCHLISTDETAILS', user: { watchlistDetailTicker:symbol,}});
        let { watchList, userName, apiKey,watchlistDetails,id, socket } =  userRef.current
        socket.emit('unsubscribeWatchList', {
            ticker: symbol,
            userName,
            apiKey,
            userId : user.id
        })

        
        console.log('watchlistDetails',watchlistDetails)
    }

    return (  
        <div>
            <form className="watchlist-form" onSubmit={handleSubmit}>
                <input type="text" className="watchlist-form-input" required placeholder="Symbol"
                value={addSymbol} onChange ={(e) => (setAddSymbol(e.target.value))} />
                <button className="watchlist-form-btn" type="submit">Add to watchlist</button>
            </form>
           
           <div className="watchlist-div">
                <table className="watchlist-table">
                    <thead>
                        <tr>
                        <td>Symbol</td>
                        <td>Price</td>                        
                        <td>low</td>
                        <td>high</td>
                        <td>volume</td>
                        <td>Day Gain %</td>
                        <td>Remove</td>
                        </tr>
                    </thead>
                    <tbody>
                        {userRef.current.watchlistDetails.map(el => (

                                <tr key={el.symbol}>
                                <td>{el.symbol}</td>
                                <td>{el.price}</td>
                                <td>{el.low}</td>
                                <td>{el.high}</td>
                                <td>{el.volume}</td>
                                <td>{el.daygain}</td>                               
                                <td onClick={(e) => removeSymbol(el.symbol, e)}>X</td>
                                </tr>
                            
                        ))}
                        
                    </tbody>
                    </table>
           </div>
            
        </div>
    );
}
 
export default Watchlist;