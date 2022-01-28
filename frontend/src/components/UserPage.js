import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUser } from '../api/ApiCalls';
import HoaxFeed from './HoaxFeed';
import ProfileCard from './ProfileCard';
const UserPage = () => {
    const[user,setUser]=useState({});
    const{username}=useParams();
    const[notFound,setNotFound]=useState(false); 
    useEffect(()=>{
        setNotFound(false);
    },[user])
    useEffect(()=>{
        const loadUsers=async()=>{
        try{
        const response=await getUser(username);
        setUser(response.data);    
    }
        catch(error){
            setNotFound(true);
        }
    } 
    loadUsers();
},[username])
    

    if(notFound){
        return(<div className="container text-center">
        
        <div className="alert alert-danger">
           <div>
           <span className="material-icons" style={{fontSize:"48px"}}>error</span>
           </div>
           <div>User Not Found</div>

        </div>
        </div>);
    }
    
    
    
    return (
        
        <div className="container">
            <div className="row">
            <div className="col">
            <ProfileCard user={user}/>
            </div>
            {user.username===username && <div className="col">
                <HoaxFeed/>
            </div>}
            </div>
           
        </div>
    );
}; 

export default UserPage;