import React from 'react';
import UserList from './UserList';
import HoaxSubmit from './HoaxSubmit';
import { useSelector } from 'react-redux';
import HoaxFeed from './HoaxFeed';
const HomePage = () => {
    const{isLoggedIn}=useSelector((store)=>{
        return {isLoggedIn:store.isLoggedIn}
    })
    return (
       
        <div className="container">
            <div className="row">
                <div className="col">
            <div className="mb-2">
                {isLoggedIn && <HoaxSubmit/>}
                </div>
                
                <HoaxFeed/>
                </div>
                <div className="col">
                <UserList/>
                </div>
                
               
                
                </div>
            </div>
            
           
    
    );
};

export default HomePage; 