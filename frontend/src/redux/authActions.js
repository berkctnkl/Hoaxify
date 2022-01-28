import { login, singnUpForm,logout } from "../api/ApiCalls";
import * as ACTIONS from "./Constants";


export const logOutSuccess= ()=>{
    return async (dispatch)=>{
      try{
        await logout();
      }catch(err){

      }
      dispatch({type:ACTIONS.LOGOUT_SUCCESS
      });
     
    };
  
};

export const loginSuccess=(authState)=>{
    
    return{
      type:ACTIONS.LOGIN_SUCCESS,  
      payload:authState
    }};
  
  export const updateSucess=({displayName,image})=>{
    return{
      type:ACTIONS.UPDATE_SUCCESS,
      payload:{
        displayName,
        image
      }
    }
  }


  export const loginHandler=(credentials)=>{
  return async (dispatch)=>{
    const response=await login(credentials);
    const authState={
      ...response.data.user,
      password:credentials.password,
      token:response.data.token
    };
    dispatch(loginSuccess(authState));
    return response;
  }
}



export const signUpHandler=(user)=>{
  return async (dispatch)=>{
    await singnUpForm(user);
     const response=await dispatch( loginHandler(user));
      return response;
    }
  }



 