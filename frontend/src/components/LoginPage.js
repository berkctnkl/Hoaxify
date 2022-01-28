import React, { useEffect, useState } from 'react';
import ButtonWithProgress from './ButtonWithProgress';
import {useDispatch} from "react-redux";
import {loginHandler} from "../redux/authActions"
import {useApiProgress} from "../api/ApiProgress";
import Input from './Input';
const LoginPage=(props)=> {
    const dispatch=useDispatch();
    const[username,setUsername]=useState();
    const[password,setPassword]=useState();
    const[error,setError]=useState();
    useEffect(()=>{
        setError(undefined);
    },[username,password])

    
    
   const onClickLogin=async (event)=>{
        event.preventDefault();
        const{history}=props
        const{push}=history;
        const creds={
            username,
            password
        }
        setError(undefined);
        try{
          await dispatch(loginHandler(creds));
           push("/"); 
        }
        catch(exception){
            setError(
                exception.response.data.message
            );
        }

    }

    
       
        const pendingApiCall=useApiProgress("/api/1.0/auth");
        const buttonEnabled=username && password;
        
        return (
            <div className="container">
                <h1 className="text-center">Login</h1>
                <form>
                
                
                    <Input label="User Name" name="username" type="text"  onChange={event=>setUsername(event.target.value)}/>
                    <Input label="Password" name="password" type="password" onChange={event=>setPassword(event.target.value)}/>
                    <div className="text-center">
                    {error && <div className="alert alert-danger" role="alert">
                    {error}
                    </div>}
                    </div>
                    <ButtonWithProgress disabled={!buttonEnabled || pendingApiCall} onClick={onClickLogin} pendingApiCall={pendingApiCall} text="Login"/>
                </form>
               
                
                
            </div>
        );
    }




export default LoginPage;
