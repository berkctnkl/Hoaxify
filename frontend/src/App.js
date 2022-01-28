
import React from 'react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import UserPage from './components/UserPage';
import {Route,Redirect,Switch, HashRouter as Router} from "react-router-dom"
import TopBar from './components/TopBar';
import {useSelector} from "react-redux";
const App=()=> {
   const {isLoggedIn}=useSelector((store)=>{
        return{ isLoggedIn:store.isLoggedIn};
   });
     
 
 return (   
    <div className="App">
      <Router>
      <TopBar/>
      <Switch>
      <Route exact path="/" component={HomePage}/>
      {!isLoggedIn && <Route path="/login" component={LoginPage}/>}
      <Route path="/signup" component={SignUpPage}/>
      <Route path="/users/:username" component={UserPage}/>
      <Redirect to="/"/>
      </Switch>
      
      </Router>
      
     
    </div>
  );
}



export default App;
