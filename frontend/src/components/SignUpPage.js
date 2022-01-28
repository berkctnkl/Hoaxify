import React, { useState } from "react";
import "../bootstrap-override.scss";
import Input from "./Input";
import ButtonWithProgress from "./ButtonWithProgress";
import {useDispatch} from "react-redux";
import {signUpHandler} from "../redux/authActions";
import {useApiProgress} from "../api/ApiProgress";
const SignUpPage=(props)=>{
    const [state,setState]=useState(
        {username:null,
        displayName: null,
        password: null,
        repeatPassword:null,
    });
   
    const [exceptions,setExceptions]=useState({});
    const dispatch=useDispatch();
    const pendingApiCallSignUp=useApiProgress("/api/1.0/users");
    const pendingApiCallLogin=useApiProgress("/api/1.0/auth");
    const pendingApiCall=pendingApiCallLogin || pendingApiCallSignUp;
    const onInputChange=(event)=>{
        const {name, value}=event.target;
        const exceptionsCopy={...exceptions};
        exceptionsCopy[name]=undefined;
        setExceptions(exceptionsCopy)
        const stateCopy={...state};
        stateCopy[name]=value;
        setState(stateCopy);
    };
    
     const handleFormSubmit=async (event) => {
        event.preventDefault();
        const{history}=props;
        const{push}=history;
        const {username,displayName,password}=state;
        const body={
            username,
            displayName,
            password
        };
        try{
            await dispatch(signUpHandler(body));
            push("/");
        }
        catch(error){
            
            if(error.response.data.validationExceptions){
                setExceptions(
                    error.response.data.validationExceptions
                    );
                    
            }
           
        }
        
    };

    
    
    
        const{username:usernameError,displayName:displayNameError,password:passwordError}=exceptions;
        let repeatPasswordError;
        if(state.password!==state.repeatPassword){
            repeatPasswordError="Password missmatch";
        }
        
        return (<div className="container">
                <h1 className='text-center'>Sign Up</h1>
            <form>
                <div className="form-group">
                   <Input label='User Name'name="username"  type="text" exception={usernameError} onChange={onInputChange} />
            
                </div>    
                <div className="form-group">
                <Input label='Display Name' name="displayName"  type="text" exception={displayNameError} onChange={onInputChange} />
                </div>
                <div className="form-group">
                <Input label='Password' name="password"  type="password" exception={passwordError} onChange={onInputChange} />
                    
                </div>
                <div className="form-group">
                        
                   <Input label='Reapet Password' name="repeatPassword"  type="password" exception={repeatPasswordError} onChange={onInputChange} />
                </div>
                <div className="text-center">
                    </div>
                    <ButtonWithProgress disabled={pendingApiCall||repeatPasswordError!==undefined} onClick={handleFormSubmit} pendingApiCall={pendingApiCall} text="Sign Up"/>
            </form>
        </div>);
    



    
    
}
export default SignUpPage;