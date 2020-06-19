import React, { useContext, useState, useEffect, useRef }  from 'react';
import { UserContext } from '../contexts/UserContext'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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

    const useStyles = makeStyles({
        table: {
          minWidth: 650,
        },

        headweight: {
            fontWeight: 700,
        }

      });

      const classes = useStyles();

    useEffect(() => {
        

    },[forceUpdate])

    const trade = (symbol,price, quantity) => {
        console.log(symbol)
        props.trade(symbol, price/quantity, quantity)
    }
    

    return ( 
        <div>
 
           <div className="trade-div">
                
            <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead className={classes.headweight}>
                <TableRow>
                    <TableCell align="right">Symbol</TableCell>
                    <TableCell align="right">Buying Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Market Value</TableCell>
                    <TableCell align="right">Action</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {typeof portfolioObj !== 'undefined' && portfolioObj.map(
                            el =>(
                    <TableRow key={el.symbol}>
                        {/* <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell> */}
                        <TableCell align="right">{el.symbol}</TableCell>
                        <TableCell align="right">{el.buyingPrice}</TableCell>
                        
                        <TableCell align="right">{el.quantity}</TableCell>
                        <TableCell align="right">{el.marketValue}</TableCell>
                        <TableCell align="right">
                        <button className="watchlist-form-btn" 
                            onClick={(e) => trade(el.symbol, 
                            el.marketValue, el.quantity)}>Trade</button>
                                       
                        </TableCell>
                    </TableRow>
                            ))}
                    

                </TableBody>
            </Table>
            </TableContainer>
                        
                   
           </div>
           {/* </form> */}
            
        </div>
     );
}
 
export default PortfolioPage;