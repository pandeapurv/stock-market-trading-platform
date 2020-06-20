import React, { useContext, useState, useEffect, useRef }  from 'react';
import { UserContext } from '../contexts/UserContext'
import Watchlist from './WatchList'
import io from "socket.io-client";
import TradePage from './TradePage'
import PortfolioPage from './PortfolioPage'
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'
import {ProtectedRoute} from './ProtectedRoute'
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import moment from 'moment'

import * as d3 from "d3"; 



const HomePage = (props) => {
    const {user, dispatch  } = useContext(UserContext);
    const userRef = useRef(user);
    const [serverTime, setServerTime] = useState([]);
    const [getQuoteTicker, setGetQuoteTicker] = useState('')
    const [compareQuoteTicker, setCompareQuoteTicker] = useState('')
    const [quote, setQuote] = useState([])
    const [showTradePage, setShowTradePage] = useState(false)
    const [showPortFolioPage, setShowPortFolioPage] = useState(false)
    const [getQuoteDetails ,setGetQuoteDetails] = useState({})
    const [showQuoteDetails, setShowQuoteDetails] = useState(false)
    const [shareValue , setShareValue] = useState(0)
    const [accValue, setAccValue] = useState(0)
    const [tradeSymbo, setTradeSymbo] =useState('')
    const [tradeQty,setTradeQty] = useState(1)
    const [tradePrice,setTradePrice] = useState(0)
    const svgRef = useRef();
    const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);
    const [selectedTimeperiod,setSelectedTimeperiod] = useState('1year')

    const [historicalDataObject,setHistoricalDataObject] = useState({})
    const [compareHistoricalDataObj, setCompareHistoricalDataObj] = useState({})
    const [xScaleVal, setXScaleVal] = useState(() => () => console.log("default ooops"))
    const [yScaleVal, setYScaleVal] = useState(() => () => console.log("default ooops"))
    const [svgVal, setSvgVal] = useState('')
    const [compareStock, setCompareStock] = useState(false)
    const [triggerComapreStock, setTriggerComapreStock] = useState(0);

    const useStyles = makeStyles({
        table: {
         
        },

        selectedCell: {
            borderBottom : '1px solid black',
        },

        headweight: {
            fontWeight: 700,
        }

      });
      const classes = useStyles();

    React.useEffect(() => {
        userRef.current = user;
        let stockval = 0
        typeof userRef.current.assetDetails !== 'undefined' && userRef.current.assetDetails.forEach(
            el => {
                stockval += Number(el.marketValue)
            }
        )
        setShareValue(stockval)

       let accval = Number(userRef.current.totalCash) + Number(shareValue)

        setAccValue(accval.toFixed(2))
    });

    /*
    D3 start chart-container
    Credits: 
    https://www.freecodecamp.org/news/how-to-build-historical-price-charts-with-d3-js-72214aaf6ba3/
    https://brendansudol.com/writing/responsive-d3
    */

    
    const responsivefy = svg => {
        // get container + svg aspect ratio
        const container = d3.select(svg.node().parentNode),
          width = parseInt(svg.style('width')),
          height = parseInt(svg.style('height')),
          aspect = width / height;
      
        // get width of container and resize svg to fit it
        const resize = () => {
          var targetWidth = parseInt(container.style('width'));
          svg.attr('width', targetWidth);
          svg.attr('height', Math.round(targetWidth / aspect));
        };
      
        // add viewBox and preserveAspectRatio properties,
        // and call resize so that svg resizes on inital page load
        svg
          .attr('viewBox', '0 0 ' + width + ' ' + height)
          .attr('perserveAspectRatio', 'xMinYMid')
          .call(resize);
      
        // to register multiple listeners for same event type,
        // you need to add namespace, i.e., 'click.foo'
        // necessary if you call invoke this function for multiple svgs
        // api docs: https://github.com/mbostock/d3/wiki/Selections#on
        d3.select(window).on('resize.' + container.attr('id'), resize);
      };

      const movingAverage = (data, numberOfPricePoints) => {
        return data.map((row, index, total) => {
          const start = Math.max(0, index - numberOfPricePoints);
          const end = index;
          const subset = total.slice(start, end + 1);
          const sum = subset.reduce((a, b) => {
            return a + b['close'];
          }, 0);
          return {
            date: row['date'],
            average: sum / subset.length
          };
        });
      };

      

    useEffect(()=> {
        console.log('getQuoteTicker',getQuoteTicker)
        let { apiKey } =  userRef.current
        gethistoricalquote()                    
    },[showQuoteDetails, selectedTimeperiod, compareStock,triggerComapreStock])

   const drawChart = () => {

   }

   const drawsecondaryChart = (data,svg,xScale,yScale) => {

    const dataSet = data.map(el =>(
        Object.assign({}, {
            date :new Date(el.date ),
            high : el.high,
            low : el.low,
            open : el.open,
            close : el.close,
            volume : el.volume,
        })
    ))


    

    console.log('dataSet',dataSet)
    console.log('xScale',xScale)
    console.log('yScale',yScale)
    const line = d3
    .line()
    .x(d => {
      return xScale(d['date']);
    })
    .y(d => {
      return yScale(d['close']);
    });
    
    console.log('svg',svg)
    svg
    .append('path')
    .data([dataSet])
    .style('fill', 'none')

    .attr('id', 'secondpriceChart')
    .attr('stroke', '#000133')
    .attr('stroke-width', '1')
    .attr('d', line);
   }

   const drawSecondStockChart = async (e) => {
    e.preventDefault();
     //// historical data
     let { apiKey } =  userRef.current
     let workday = getLatestWorkday()
     console.log('workday',workday)
     let fifthday = getnthlastDay(5);
     let onemonthday = getnthlastDay(30)
     let sixmonthday = getnthlastDay(180)
     let oneyearday = getnthlastDay(360)
     console.log('oneyearday',oneyearday)
     let historicalData = new Object();

     let oneDayDataResponse = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/oneday/${compareQuoteTicker}/${apiKey}/${workday}`) 
     let oneDayResponseJson = await oneDayDataResponse.json()

     let fiveDaysDataResponse = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/fivedays/${compareQuoteTicker}/${apiKey}/${fifthday}`) 
     let fiveDaysResponseJson = await fiveDaysDataResponse.json()

     let oneMonthDataResponse = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/onemonth/${compareQuoteTicker}/${apiKey}/${onemonthday}`) 
     let oneMonthResponseJson = await oneMonthDataResponse.json()

     let sixMonthsDataResponse = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/sixmonths/${compareQuoteTicker}/${apiKey}/${sixmonthday}`) 
     let sixMonthsDataResponseJson = await sixMonthsDataResponse.json()

     let yearDataResponse = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/oneyear/${compareQuoteTicker}/${apiKey}/${oneyearday}`) 
     let yearDataResponseJson = await yearDataResponse.json()
     
     historicalData.oneDayData = oneDayResponseJson.response
     historicalData.fiveDaysData = fiveDaysResponseJson.response
     historicalData.oneMonthData = oneMonthResponseJson.response
     historicalData.sixMonthsData = sixMonthsDataResponseJson.response
     historicalData.yearData= yearDataResponseJson.response
     
     setCompareHistoricalDataObj(historicalData)
     setCompareStock(true)
     setTriggerComapreStock(prev => prev +1)
     //drawsecondaryChart(historicalData.yearData)
   }


    const gethistoricalquote = async () => {
        if(showQuoteDetails){
            // let response = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/${getQuoteTicker}/${apiKey}/2019-12-15`)
            // //if(response !== undefined && response!==''){
               
            
            // let res = await response.json()
            
            // console.log('res',res)
            // console.log('typeofres', typeof res)
            // console.log(res.response[0])
            // const data = res.response
            // console.log('data',data)
            console.log('historicalDataObject',historicalDataObject)
            console.log('selectedTimeperiod',selectedTimeperiod)
            let data = [];
            if(selectedTimeperiod === '1day'){
                 data = historicalDataObject.oneDayData
            }else if(selectedTimeperiod === '5days'){
                console.log('indise 5days',historicalDataObject.oneDayData)
                  data = historicalDataObject.fiveDaysData
            }else if(selectedTimeperiod === '1month'){
                  data = historicalDataObject.oneMonthData
            }else if(selectedTimeperiod === '6months'){
                  data = historicalDataObject.sixMonthsData
            }else {
                  data = historicalDataObject.yearData
            }

            console.log('apurv data',data)
            d3.select('.mainchart')
            .remove();
           

            const dataSet = data.map(el =>(
                Object.assign({}, {
                    date :new Date(el.date ),
                    high : el.high,
                    low : el.low,
                    open : el.open,
                    close : el.close,
                    volume : el.volume,
                })
            ))

            console.log('dataSet',dataSet)

            const margin = { top: 30, right: 50, bottom: 50, left: 50 };
            const width = window.innerWidth - margin.left - margin.right; // Use the window's width
            const height = window.innerHeight - margin.top - margin.bottom; // Use the window's height

            
            console.log('svgRef width',svgRef.current.offsetWidth)

            const xMin = d3.min(dataSet, d => {
                return d['date'];
              });
              console.log('xMin',xMin)
            
              const xMax = d3.max(dataSet, d => {
                return d['date'];
              });

              console.log('xMax',xMax)
            
              let yMin = d3.min(dataSet, d => {
                return d['close'];
              });
            
              let yMax = d3.max(dataSet, d => {
                return d['close'];
              });


              if(compareStock){
                let secondStockData = []
                if(selectedTimeperiod === '1day'){
                    secondStockData = compareHistoricalDataObj.oneDayData
               }else if(selectedTimeperiod === '5days'){
                    console.log('indise 5days',compareHistoricalDataObj.oneDayData)
                    secondStockData = compareHistoricalDataObj.fiveDaysData
               }else if(selectedTimeperiod === '1month'){
                    secondStockData = compareHistoricalDataObj.oneMonthData
               }else if(selectedTimeperiod === '6months'){
                    secondStockData = compareHistoricalDataObj.sixMonthsData
               }else {
                    secondStockData = compareHistoricalDataObj.yearData
               }

               const  secondStockDataSet = secondStockData.map(el =>(
                Object.assign({}, {
                    date :new Date(el.date ),
                    high : el.high,
                    low : el.low,
                    open : el.open,
                    close : el.close,
                    volume : el.volume,
                })
            ))

                let yMinSecondDataSet = d3.min(secondStockDataSet, d => {
                    return d['close'];
                });

                yMin = Math.min(yMin,yMinSecondDataSet)
                
                let yMaxSecondDataSet = d3.max(secondStockDataSet, d => {
                    return d['close'];
                });

                yMax = Math.max(yMax,yMaxSecondDataSet)

                  
              }

              // scale using range
              let padding = 30;
            const xScale = d3
            .scaleTime()
            .domain([xMin, xMax])
            .range([0, width]);
            //.range([padding, width - padding])
            setXScaleVal(() => xScale)

            const yScale = d3
            .scaleLinear()
            .domain([yMin - 5, yMax])
            .range([height, 0]);
            //.range([height - padding, padding])
            setYScaleVal(() => yScale)

            const svg = d3.select(svgRef.current).append('svg')
            svg
            .attr('width', width + margin['left'] + margin['right'])
            .attr('height', height + margin['top'] + margin['bottom'])
            .attr('class', 'mainchart')
            .call(responsivefy)
            .append('g')
            .attr('transform', `translate(${margin['left']}, ${margin['top']})`);
              
             // create the axes component
            svg
            .append('g')
            .attr('id', 'xAxis')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

            svg
            .append('g')
            .attr('id', 'yAxis')
            .attr('transform', `translate(${width}, 0)`)
            .call(d3.axisRight(yScale));

            const line = d3
            .line()
            .x(d => {
              return xScale(d['date']);
            })
            .y(d => {
              return yScale(d['close']);
            });

            setSvgVal(svg)
            console.log('outside compare')
            if(compareStock){
                console.log('inside compare')
                let secondStockData = []
                if(selectedTimeperiod === '1day'){
                    secondStockData = compareHistoricalDataObj.oneDayData
               }else if(selectedTimeperiod === '5days'){
                    console.log('indise 5days',compareHistoricalDataObj.oneDayData)
                    secondStockData = compareHistoricalDataObj.fiveDaysData
               }else if(selectedTimeperiod === '1month'){
                    secondStockData = compareHistoricalDataObj.oneMonthData
               }else if(selectedTimeperiod === '6months'){
                    secondStockData = compareHistoricalDataObj.sixMonthsData
               }else {
                    secondStockData = compareHistoricalDataObj.yearData
               }
                drawsecondaryChart(secondStockData,svg,xScale,yScale)
                
            }

            const movingAverageLine = d3
            .line()
            .x(d => {
              return xScale(d['date']);
            })
            .y(d => {
              return yScale(d['average']);
            })
            .curve(d3.curveBasis);

            svg
            .append('path')
            .data([dataSet])
            .style('fill', 'none')
            .style('height','90%')
            .attr('id', 'priceChart')
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('d', line);

            const movingAverageData = movingAverage(dataSet, 49);
            svg
              .append('path')
              .data([movingAverageData])
              .style('fill', 'none')
              .attr('id', 'movingAverageLine')
              .attr('stroke', '#040ab8')
              .attr('d', movingAverageLine);

            const yMinVolume = d3.min(dataSet, d => {
            return Math.min(d['volume']);
            });
        
            const yMaxVolume = d3.max(dataSet, d => {
            return Math.max(d['volume']);
            });

            const yVolumeScale = d3
            .scaleLinear()
            .domain([yMinVolume, yMaxVolume])
            .range([height, height * (3 / 4)]);

            svg
            .selectAll()
            .data(dataSet)
            .enter()
            .append('rect')
            .attr('x', d => {
              return xScale(d['date']);
            })
            .attr('y', d => {
              return yVolumeScale(d['volume']);
            })
            .attr('class', 'vol')
            .attr('fill', (d, i) => {
              if (i === 0) {
                return '#03a678';
              } else {
                return dataSet[i - 1].close > d.close ? '#c0392b' : '#03a678'; // green bar if price is rising during that period, and red when price  is falling
              }
            })
            .attr('width', 1)
            .attr('height', d => {
              return height - yVolumeScale(d['volume']);
            });


            //// CandleStick Start

            svg
            .append('g')
            .attr('id', 'candlesticks-series')

            const bodyWidth = 5;
            const candlesticksLine = d3
              .line()
              .x(d => d['x'])
              .y(d => d['y']);
      
            const candlesticksSelection = d3
              .select('#candlesticks-series')
              .selectAll('.candlestick')
              .data(dataSet, d => d['volume']);
      
            candlesticksSelection.join(enter => {
              const candlesticksEnter = enter
                .append('g')
                .attr('class', 'candlestick')
                .append('g')
                .attr('class', 'bars')
                .classed('up-day', d => d['close'] > d['open'])
                .classed('down-day', d => d['close'] <= d['open']);
              candlesticksEnter
                .append('path')
                .classed('high-low', true)
                .attr('d', d => {
                  return candlesticksLine([
                    { x: xScale(d['date']), y: yScale(d['high']) },
                    { x: xScale(d['date']), y: yScale(d['low']) }
                  ]);
                });
              candlesticksEnter
                .append('rect')
                .attr('x', d => xScale(d.date) - bodyWidth / 2)
                .attr('y', d => {
                  return d['close'] > d['open']
                    ? yScale(d.close)
                    : yScale(d.open);
                })
                .attr('width', bodyWidth)
                .attr('height', d => {
                  return d['close'] > d['open']
                    ? yScale(d.open) - yScale(d.close)
                    : yScale(d.close) - yScale(d.open);
                });
            });


            //// CandleStick End
            


            // renders x and y crosshair
            const focus = svg
            .append('g')
            .attr('class', 'focus')
            .style('display', 'none');

            focus.append('circle').attr('r', 4.5);
            focus.append('line').classed('x', true);
            focus.append('line').classed('y', true);

            svg
            .append('rect')
            .attr('class', 'overlay')
            .attr('width', width )
            .attr('height', height +10)
            .on('mouseover', () => focus.style('display', null))
            .on('mouseout', () => focus.style('display', 'none'))
            .on('mousemove', generateCrosshair);

            d3.select('.overlay').style('fill', 'none');
            d3.select('.overlay').style('pointer-events', 'all');

            d3.selectAll('.focus line').style('fill', 'none');
            d3.selectAll('.focus line').style('stroke', '#67809f');
            d3.selectAll('.focus line').style('stroke-width', '1.5px');
            d3.selectAll('.focus line').style('stroke-dasharray', '3 3');

            //returs insertion point
            const bisectDate = d3.bisector(d => d.date).left;

            /* mouseover function to generate crosshair */
            function generateCrosshair() {
            //returns corresponding value from the domain
            const correspondingDate = xScale.invert(d3.mouse(this)[0]);
            //gets insertion point
            const i = bisectDate(dataSet, correspondingDate, 1);
            const d0 = dataSet[i - 1];
            const d1 = dataSet[i];
            const currentPoint =
                correspondingDate - d0['date'] > d1['date'] - correspondingDate ? d1 : d0;
            focus.attr(
                'transform',
                `translate(${xScale(currentPoint['date'])}, ${yScale(
                currentPoint['close']
                )})`
            );

            focus
                .select('line.x')
                .attr('x1', 0)
                .attr('x2', width - xScale(currentPoint['date']))
                .attr('y1', 0)
                .attr('y2', 0);

            focus
                .select('line.y')
                .attr('x1', 0)
                .attr('x2', 0)
                .attr('y1', 0)
                .attr('y2', height - yScale(currentPoint['close']));

            // updates the legend to display the date, open, close, high, low, and volume of the selected mouseover area
            updateLegends(currentPoint);
            }

            /* Legends */
            const updateLegends = currentData => {
            d3.selectAll('.lineLegend').remove();

            const legendKeys = Object.keys(data[0]);
            
            console.log('legendKeys',legendKeys)
            const lineLegend = svg
                .selectAll('.lineLegend')
                .data(["date","close","high","low","open", "volume"]) 
                .enter()
                .append('g')
                .attr('class', 'lineLegend')
                .attr('transform', (d, i) => {
                return `translate(0, ${i * 20})`;
                });
            lineLegend
                .append('text')
                .text(d => {
                if (d === 'date') {
                    return `${d}: ${currentData[d].toLocaleDateString()}`;
                } else if (
                    d === 'high' ||
                    d === 'low' ||
                    d === 'open' ||
                    d === 'close'
                ) {
                    return `${d}: ${currentData[d].toFixed(2)}`;
                } else {
                    return `${d}: ${currentData[d]}`;
                }
                })
                .style('fill', 'black')
                .attr('transform', 'translate(25,15)'); //align texts with boxes
            };



                        }
                    }
       
   //}
   /*
   0:
close: 102.38999938965
date: Tue Jan 02 2018 09:30:00 GMT-0500 (Eastern Standard Time) {}
high: 102.45999908447
low: 102.12999725342
open: 102.36000061035
volume: 881200
__proto__: Object
   */
    /*
    D3 end
    */

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
                    dispatch({ type: 'UPDATEASSETPRICEDETAILS', user: { assetDetail,  }});

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

    const testRemove = () => {
        d3.select('.mainchart')
        .select('#candlesticks-series')
        .remove();
    }

    function getLatestWorkday(){
        let workday = moment();
        let day = workday.day();
        console.log('day',day)
        let diff = 0; 
        if(day == 7){
            diff = 2;
        }
        if(day == 6){
            diff = 1;
        }
        return moment(workday.subtract(diff, 'days')).format('YYYY-MM-DD');
      }

      function getnthlastDay(n){
        let workday = moment();
        let day = workday.day();
        return moment(workday.subtract(n, 'days')).format('YYYY-MM-DD');
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        let { apiKey } =  userRef.current
        console.log('getQuoteTicker',getQuoteTicker)
        setShowQuoteDetails(false)
        setCompareStock(false)
        let response = await fetch(`http://localhost:5000/api/tiingo/stock/quote/${getQuoteTicker}/${apiKey}`)
        if(response !== undefined && response!=='' ){
            
            console.log('response',response)
            console.log(typeof response)
            let res = await response.json()
            //if(Object.keys(res).length !== 0 && res.constructor !== Object){

            
            console.log('res',res)
            console.log(typeof res)
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

            //// historical data
            let workday = getLatestWorkday()
            console.log('workday',workday)
            let fifthday = getnthlastDay(5);
            let onemonthday = getnthlastDay(30)
            let sixmonthday = getnthlastDay(180)
            let oneyearday = getnthlastDay(360)
            console.log('oneyearday',oneyearday)
            let historicalData = new Object();

            let oneDayDataResponse = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/oneday/${getQuoteTicker}/${apiKey}/${workday}`) 
            let oneDayResponseJson = await oneDayDataResponse.json()

            let fiveDaysDataResponse = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/fivedays/${getQuoteTicker}/${apiKey}/${fifthday}`) 
            let fiveDaysResponseJson = await fiveDaysDataResponse.json()

            let oneMonthDataResponse = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/onemonth/${getQuoteTicker}/${apiKey}/${onemonthday}`) 
            let oneMonthResponseJson = await oneMonthDataResponse.json()

            let sixMonthsDataResponse = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/sixmonths/${getQuoteTicker}/${apiKey}/${sixmonthday}`) 
            let sixMonthsDataResponseJson = await sixMonthsDataResponse.json()

            let yearDataResponse = await fetch(`http://localhost:5000/api/tiingo/stock/historicalquote/oneyear/${getQuoteTicker}/${apiKey}/${oneyearday}`) 
            let yearDataResponseJson = await yearDataResponse.json()
            
            historicalData.oneDayData = oneDayResponseJson.response
            historicalData.fiveDaysData = fiveDaysResponseJson.response
            historicalData.oneMonthData = oneMonthResponseJson.response
            historicalData.sixMonthsData = sixMonthsDataResponseJson.response
            historicalData.yearData= yearDataResponseJson.response

            setHistoricalDataObject(historicalData)
            console.log('data',data)


            ////
            
            setTradeSymbo(getQuoteTicker)
            setTradeQty(1)
            setTradePrice(res.response[0].last.toFixed(2))
            drawChart();
            setShowQuoteDetails(true)
        //}
    }
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

    const showHomePage = () => {
        setShowTradePage(false)
        setShowPortFolioPage(false)
        setShowQuoteDetails(false)
        setCompareStock(false)
        
    }
    const showPortFolio =() => {
        setShowTradePage(false)
        setShowPortFolioPage(true)

        
    }
    const redirectToPortfolio = () => {
        console.log('inside redirectToPortfolio')
        //props.history.push('/home/portfolio')
        setShowTradePage(false)
        setShowPortFolioPage(true)

    }

    const trade = (symbol, price, quantity) => {
        console.log('trade',symbol)
        setTradeSymbo(symbol)
        setTradeQty(quantity)
        setTradePrice(price)
        setShowTradePage(true)
        setShowPortFolioPage(false)
        

    }



    const tradeStock = () => {
        setShowTradePage(true)
        setShowPortFolioPage(false)
    }

    const changeTimePeriod = (timeperiod) => {
        console.log('timeperiod',timeperiod)
        setSelectedTimeperiod(timeperiod)
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
                            <div className="nav-account-info-val">${accValue}</div>                           
                        </li>
                        <li className="nav-account-info-li">
                            <div className="nav-account-info-title">Total cash </div>
                            <div className="nav-account-info-val">${Number(userRef.current.totalCash).toFixed(2)}</div>
                        </li>
                        <li className="nav-account-info-li">
                            <div className="nav-account-info-title">Positions</div>
                            <div className="nav-account-info-val">${Number(shareValue).toFixed(2)}</div>
                        </li>
                    </ul>
                </nav>
            </div>
            <div>
                <nav className="nav-tabs">
                    <ul className="nav-tabs-ul">
                        <li className="nav-tabs-li"
                        onClick={() => showHomePage()}>Home</li>
                        <li className="nav-tabs-li" 
                        onClick={() => showPortFolio()}>Portfolio</li>
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
        trade= {trade} showPortFolioPage={showPortFolioPage}/>
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
                    <div className="quotedetails-symbol">
                    <span>{getQuoteDetails.symbol} </span>
                        <button className=" add-to-watchList-btn"
                        onClick={() => addToWatchList() } >Add to watch list</button>
                        <button className="add-to-watchList-btn" 
                        onClick={() =>  tradeStock()} >
                        {/* <Link to={`${match.url}/props-v-state`}>Add to watch list</Link> */}
                        {/* <Link to="/home/trade"> */}
                        Trade
                        {/* </Link> */}
                    </button>
                    </div>
                    
                    <div className="quotedetails-lprice">{getQuoteDetails.price}</div>
                    <div className="quotedetails-change">{getQuoteDetails.changepercent} %</div>
                    <div className="quotedetails-open">Open: {getQuoteDetails.open}</div>
                    <div className="quotedetails-close">Previous Close: {getQuoteDetails.prevClose}</div>
                </div>
            </div>}
            

            {showQuoteDetails &&  <TableContainer className="chart-container" component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead className={classes.headweight}>
        <TableRow>
        <TableCell align="left">
            <form className="watchlist-form" onSubmit={drawSecondStockChart} >
                <input type="text" className="watchlist-form-input" required placeholder="Symbol"
                    value={compareQuoteTicker}
                    onChange ={(e) => (setCompareQuoteTicker(e.target.value))}   />
                <button className="watchlist-form-btn" type="submit">compare</button>
            </form>
        </TableCell>
        </TableRow>
          <TableRow>
            <TableCell align="left"
            
            className={clsx("graph-table-cell", selectedTimeperiod === '1day' && classes.selectedCell)}
            //className="graph-table-cell"
            onClick={() => changeTimePeriod('1day')}
            >1 day</TableCell>
            <TableCell align="left"
            className={ clsx("graph-table-cell",selectedTimeperiod === '5days' && classes.selectedCell)}
            onClick={() => changeTimePeriod('5days')}>5 days</TableCell>
            <TableCell align="left"
            className={ clsx("graph-table-cell",selectedTimeperiod === '1month' && classes.selectedCell)}
            onClick={() => changeTimePeriod('1month')}>1 month</TableCell>
            <TableCell align="left"
            className={ clsx("graph-table-cell",selectedTimeperiod === '6months' && classes.selectedCell)}
            onClick={() => changeTimePeriod('6months')}>6 months</TableCell>
            <TableCell align="left"
            className={ clsx("graph-table-cell",selectedTimeperiod === '1year' && classes.selectedCell)}
            onClick={() => changeTimePeriod('1year')}>1 year</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

            {/* <TableRow key={1}>
              <TableCell rowSpan={2} colSpan={5} align="right">
              
              </TableCell>
            </TableRow> */}

        </TableBody>
      </Table>
      <div className="graph-container" ref={svgRef} >
                </div>
    </TableContainer>}


        </div>}
        
    </div>

    {/* <Switch>                        
        <Route path="/home/trade" component={TradePage} />
    </Switch>  */}
    
    </React.Fragment>
     );
}
 
export default HomePage;