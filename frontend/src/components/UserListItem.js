import React from 'react';
import { Link } from 'react-router-dom';
import ProfileImage from './ProfileImage';

const UserListItem = (props) => {
    const{user}=props;
    const{username,displayName}=user;
    return(
        
    <Link to={`users/${username}`} className="list-group-item list-group-item-action">
         
            <ProfileImage image={user.image} className="rounded-circle" height="32" width="32" 
            alt={`${username} Profile`}/>
            <span className="ps-2">
            {displayName}@{username}
            </span>
            
            
            
      
        
         
         
        </Link>)
        
    
};

export default UserListItem;