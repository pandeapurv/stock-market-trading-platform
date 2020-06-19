import React, { useContext, useState, useEffect,useRef }  from 'react';
import { UserContext } from '../contexts/UserContext'
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const Watchlist = () => {

    const {user, dispatch  } = useContext(UserContext);

    const [addSymbol, setAddSymbol] = useState('')
    const userRef = useRef(user);

    const useStyles = makeStyles({
        table: {
          minWidth: 650,
        },

        headweight: {
            fontWeight: 700,
        }

      });
      const classes = useStyles();
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
                {/* <table className="watchlist-table">
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
                                <td onClick={(e) => removeSymbol(el.symbol, e)}>
                                <DeleteIcon /></td>
                                </tr>
                            
                        ))}
                        
                    </tbody>
                    </table> */}

                    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead className={classes.headweight}>
          <TableRow>
            <TableCell align="right">Symbol</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">low</TableCell>
            <TableCell align="right">high</TableCell>
            <TableCell align="right">volume</TableCell>
            <TableCell align="right">Day Gain %</TableCell>
            <TableCell align="right">Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {userRef.current.watchlistDetails.map(el => (
            <TableRow key={el.symbol}>
              {/* <TableCell component="th" scope="row">
                {row.name}
              </TableCell> */}
              <TableCell align="right">{el.symbol}</TableCell>
              <TableCell align="right">{el.price}</TableCell>
              <TableCell align="right">{el.low}</TableCell>
              <TableCell align="right">{el.high}</TableCell>
              <TableCell align="right">{el.volume}</TableCell>
              <TableCell align="right">{el.daygain}</TableCell>
              <TableCell align="right" onClick={(e) => removeSymbol(el.symbol, e)}>
              <DeleteIcon /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
           </div>
            
        </div>
    );
}
 
export default Watchlist;