import React,{useEffect, useRef, useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import logo from "../assets/hoaxify-logo.png"
import {useDispatch,useSelector} from "react-redux";
import {logOutSuccess} from "../redux/authActions";
import ProfileImage from './ProfileImage';
const TopBar=(props)=> {
    const dispatch=useDispatch();
    const history=useHistory();
    const onClickLogout=()=>{
        dispatch(logOutSuccess());
    };
        const{isLoggedIn,username,displayName,image}=useSelector((store)=>{
            return{isLoggedIn:store.isLoggedIn,
                   username:store.username,
                   displayName:store.displayName,
                   image:store.image 
                }});
        const[menuVisible,setMenuVisible]=useState(false);
        
        const menuArea=useRef(null);
        
        useEffect(()=>{
            document.addEventListener("click",menuClickTracker);
            return ()=>{
                document.removeEventListener("click",menuClickTracker);
            }
        },[isLoggedIn]);

        const menuClickTracker=(event)=>{
            if(menuArea.current===null || !menuArea.current.contains(event.target)){
                setMenuVisible(false);
            }
        }


        let links=(
        <ul className="navbar-nav ms-auto">
        <li>

        
        <Link className="nav-link" to="/login">
            Login
        </Link>
    
    </li>
    <li>
        <Link className="nav-link" to="/signup">
            Sign Up
        </Link>
    
    </li>
</ul>)
    if(isLoggedIn){
    let dropdownClass="dropdown-menu p-0 shadow";
    if(menuVisible){
        dropdownClass+=" show"
    }     
    links=(
            <ul className="navbar-nav ms-auto" ref={menuArea}>
        <li className="nav-item dropdown">
    <div className="d-flex" style={{cursor:"pointer"}} onClick={()=>setMenuVisible(true)}>
        <ProfileImage  className= "rounded-circle m-auto" image={image} width="32" height="32"/>
            <span className= "nav-link dropdown-toggle">{displayName}</span>
    </div>
        <div className={dropdownClass}>
       
        <Link className="dropdown-item d-flex p-2" onClick={()=>{setMenuVisible(false);}} to={"/users/"+username}>
        <span className="material-icons text-info me-2">person</span>
            My Profile
        </Link>
    
   
   
        <span className="dropdown-item d-flex p-2" onClick={onClickLogout} to="/">
        <span className="material-icons text-danger me-2">power_settings_new</span>
            Logout
        </span>
    
    
        </div>
        </li>
        
   
</ul>
        )
    }
        return (
            <div className="shadow-sm bg-light mb-2">
                <nav className="navbar navbar-light container navbar-expand">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} width="60" alt="Hoaxify Logo"/>
                        Hoaxify
                    </Link>
                    {links}
                </nav>
                
            </div>
        );
}




export default TopBar;