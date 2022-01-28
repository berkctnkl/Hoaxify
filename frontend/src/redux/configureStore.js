import authReducer from "./authReducer";
import thunk from "redux-thunk"
import {applyMiddleware, createStore} from "redux";
import SecureLS from "secure-ls";
import { setAuthorizationHeader } from "../api/ApiCalls";
  
 const secureLS=new SecureLS();       
    
const getStateFromStorage=()=>{
        let stateInLocalStorage={
            isLoggedIn:false,
            username:undefined,
            displayName:undefined,
            image:undefined,
            password:undefined
            };
            const hoaxAuth=secureLS.get("hoax-auth");
            if(hoaxAuth){
                return hoaxAuth;
            }
        return stateInLocalStorage;
    };

    const updateStateInStorage=(newState)=>{
        secureLS.set("hoax-auth",newState);
    };
    
    
    const configureStore=()=> {
        const initialState=getStateFromStorage();
        setAuthorizationHeader(initialState);
        const store=createStore(authReducer,initialState,applyMiddleware(thunk));
        store.subscribe(()=>{
            setAuthorizationHeader(store.getState());
            updateStateInStorage(store.getState());
        
    });
        return store;
};


export default configureStore;