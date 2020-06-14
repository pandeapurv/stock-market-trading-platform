import React, { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext'
import io from "socket.io-client";


const fakeAuth = {
    isAuthenticated : false,
  
    signIn(cb) {
      this.isAuthenticated= true;
      setTimeout(cb,100)
    },
  
    signOute(cb){
      this.isAuthenticated= false;
      setTimeout(cb,100)
    }
  }

  

const LoginPage = (props) => {
    
    const {user, dispatch } = useContext(UserContext);

    const [userName, setUserName] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [watchList, setWatchList] = useState(['AAPL','AMZN'])
    const [accValue, setAccValue] = useState(100000)
    const [postions, setPostions] = useState(0)
    const [totalCash, setTotalCash] = useState(100000)

    const handleSubmit = (e) => {
        e.preventDefault();
        //setWatchList(['AAPL','AMZN','IXIC'])
        const socket = io("http://localhost:5000");
        dispatch({ type: 'LOGIN', user: { userName, apiKey
             , watchList, socket, accValue, postions, totalCash
        }});
        props.history.push('/home')
    }
    return (
        <div className="login-page">
            <div className="intro"></div>
            <div className="main-content">
                <p> This applications shows price charts of stocks, currencies and indexes. 
                You would need an tiingo api key to login. In setting tabs you can 
                control frequencey of data fetch depending on your plan
                </p>          
                <form className="login-form" onSubmit={handleSubmit}>
                    <input type="text" className="login-form-name" required placeholder="first name"
                    value={userName} onChange ={(e) => (setUserName(e.target.value))} />
                    <input type="password" className="login-form-api" required  placeholder="tiingo api key" 
                    value={apiKey}
                    onChange ={(e) => (setApiKey(e.target.value))} />
                    <button className="btn btn-login" type="submit">Login</button>
                </form>
            </div>
        </div>
     );
}
 
export default LoginPage;