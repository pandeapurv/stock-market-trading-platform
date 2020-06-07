import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import LoginPage from './LoginPage'
import HomePage from './HomePage'
import UserContextProvider from '../contexts/UserContext'
import {ProtectedRoute} from './ProtectedRoute'

function App() {
  return ( 
    <UserContextProvider>
      {/* <Router> */}
        <div className = "App">        
            <Switch>           
              <Route exact path="/" component={LoginPage} />             
              <ProtectedRoute path="/home" component={HomePage} />
              <Route path="*" render ={()=><h1>404</h1>}/>
            </Switch>             
        </div>
      {/* </Router>    */}
    </UserContextProvider> 
   
  );
}


export default App;