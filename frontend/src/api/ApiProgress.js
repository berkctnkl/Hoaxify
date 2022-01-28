import axios from "axios";
import { useState,useEffect } from "react";

export const useApiProgress=(apiPath)=>{
const[pendingApiCall,setPendingApiCall]=useState(false);
useEffect(()=>{
let requestInterceptor,reponseInterceptor;
const updateApiCallFor=(url,inProgress)=>{
    if(url.startsWith(apiPath)){
        setPendingApiCall(inProgress);
    }
}
const registerInterceptors=()=>{
 requestInterceptor=axios.interceptors.request.use((request)=>{
     updateApiCallFor(request.url,true);
    });
  reponseInterceptor=axios.interceptors.response.use((response)=>{
      updateApiCallFor(response.config.url,false);
      return response;
    },(error)=>{
        updateApiCallFor(error.config.url,false);
        throw error;
    });  

};
const unRegisterInterceptors=()=>{
    axios.interceptors.request.eject(requestInterceptor);
    axios.interceptors.response.eject(reponseInterceptor);
};
registerInterceptors();
return unRegisterInterceptors()
}
);
return pendingApiCall;
}