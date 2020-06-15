import React, { useContext, useState, useEffect, useRef }  from 'react';
import { UserContext } from '../contexts/UserContext'

const PortfolioPage = (props) => {
    const {user, dispatch  } = useContext(UserContext);
    const [portfolioObj, setPortfolioObj] = useState([])
    const userRef = useRef(user);
    const [forceUpdate, setForceUpdate] =useState(props.showPortFolioPage)

    React.useEffect(() => {
        userRef.current = user;
    });
    React.useEffect(() => {
        console.log('portfolio')
        let { assetDetails } = userRef.current 
        console.log('assetDetails',assetDetails)
        setPortfolioObj(assetDetails)

    })

    useEffect(() => {
        

    },[forceUpdate])

    const trade = (symbol,price, quantity) => {
        console.log(symbol)
        props.trade(symbol, price/quantity, quantity)
    }
    

    return ( 
        <div>
 
           <div className="trade-div">
                <table className="trade-table">
                    <thead>
                        <tr>
                        <td>Symbol</td>
                        <td>Buying Price</td>                        
                        <td>Quantity</td>
                        <td>Market Value</td>
                        <td>Trade</td>
                        </tr>
                    </thead>
                    <tbody>
                        {typeof portfolioObj !== 'undefined' && portfolioObj.map(
                            el => {
                                return (
                                    <tr key={el.symbol}>
                                        <td>{el.symbol}</td>
                                        <td>{el.buyingPrice}</td>
                                        <td>{el.quantity}</td>
                                        <td>{el.marketValue}</td>
                                        <td
                                        onClick={(e) => trade(el.symbol, 
                                            el.marketValue, el.quantity)}>Trade</td>
                                    </tr>  
                                )
                            }
                        )}
                        {/* <tr key={symbol}>
                            <td>{symbol}</td>
                            <td>{stockPrice}</td>
                            <td><input type="text" className="watchlist-form-input" 
                            required placeholder="quantity"
                    value={tradeQty} onChange ={(e) => (setTradeQty(e.target.value))} /></td>
                            <td>{stockPrice*tradeQty}</td>
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
                        </tr> */}
                        
                    </tbody>
                    </table>
           </div>
           {/* </form> */}
            
        </div>
     );
}
 
export default PortfolioPage;