import axios from "axios";
 export const singnUpForm= (body)=>{ 
       return axios.post('api/1.0/users',body);
 }
 export const login=(creds)=>{
       return axios.post("api/1.0/auth",creds)
 }
 export const logout=()=>{
      return axios.post("api/1.0/logout");
}

export const getAllUsers=(page=0,size=3)=>{
      return axios.get(`api/1.0/users?page=${page}&size=${size}`);
}

export const setAuthorizationHeader=({isLoggedIn,token})=>{
      
      if(isLoggedIn){
            const authHeaderValue=`Bearer ${token}`;
            axios.defaults.headers['Authorization']=authHeaderValue;
      }
      else{
            delete axios.defaults.headers['Authorization'];
      }
}



export const getUser=(username)=>{
      return axios.get(`api/1.0/users/${username}`);
}

export const updateUser=(username,body)=>{
      return axios.put(`api/1.0/users/${username}`,body);
}

export const postHoax=(body)=>{
      return axios.post("api/1.0/hoaxes",body);
}

export const getAllHoaxes=(page=0,username)=>{
      const path=username ? `api/1.0/users/${username}/hoaxes?page=${page}`: `api/1.0/hoaxes?page=${page}`;
      return axios.get(path);
}

export const getOldHoaxes=(username,id)=>{
      const path=username ?`api/1.0/users/${username}/hoaxes/${id}` : `api/1.0/hoaxes/${id}`;
      return axios.get(path);
}

export const getNewHoaxesCount=(id,username)=>{
     const path=username ? `api/1.0/users/${username}/hoaxes/${id}?count=true`:`api/1.0/hoaxes/${id}?count=true`;
      return axios.get(path);
}

export const getNewHoaxes=(username,id)=>{
    const path=username ? `api/1.0/users/${username}/hoaxes/${id}?direction=after`: `api/1.0/hoaxes/${id}?direction=after`; 
      return axios.get(path);
}
export const postHoaxAttachment=(attachment)=>{
     
      return axios.post("api/1.0/hoax-attachments",attachment);
}

export const deleteHoax=(id)=>{
      return axios.delete(`api/1.0/hoaxes/${id}`);
}

export const deleteUser=(username)=>{
      return axios.delete(`api/1.0/users/${username}`);
}