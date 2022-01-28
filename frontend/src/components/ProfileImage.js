import React from 'react';
import defaultImage from "../assets/profile.png";
const ProfileImage = (props) => {
    let imageSource=defaultImage;
    const{image,tempimage}=props;
    if(image){
        imageSource=`images/${image}`;
    }
    return (
        
        <img src={ tempimage||imageSource} 
        alt="Profile" {...props}
        onError={(event)=>{
            event.target.src=defaultImage;
        }}/>
            
        
    );
    }
export default ProfileImage;