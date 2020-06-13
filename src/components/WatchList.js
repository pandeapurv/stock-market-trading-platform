import React, { useContext, useState, useEffect }  from 'react';
import { UserContext } from '../contexts/UserContext'

const Watchlist = () => {

    const {user, dispatch  } = useContext(UserContext);
    const { watchList, socket, userName, apiKey,watchlistDetails } = user
    console.log('watchlistDetails page', watchlistDetails)

    // React.useEffect(() => {
    //     userRef.current = user;
    // });

    return (  
        <div>
            <form className="watchlist-form" action="#" method="POST">
                <input type="text" className="watchlist-form-input" required placeholder="Symbol"/>
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
                        {watchlistDetails.map(el => (

                                <tr key={el.symbol}>
                                <td>{el.symbol}</td>
                                <td>{el.price}</td>
                                <td>{el.low}</td>
                                <td>{el.high}</td>
                                <td>{el.volume}</td>
                                <td>{el.daygain}</td>                               
                                <td>X</td>
                                </tr>
                            
                        ))}
                        
                    </tbody>
                    </table>
           </div>
            
        </div>
    );
}
 
export default Watchlist;