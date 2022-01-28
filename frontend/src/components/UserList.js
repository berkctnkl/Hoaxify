import React, {useEffect, useState } from 'react';
import {getAllUsers} from "../api/ApiCalls"
import { useApiProgress } from '../api/ApiProgress';
import UserListItem from './UserListItem';
const UserList=()=> {
    const[page,setPage]=useState(
        {content:[],
            number:0,
            size:3,
            first:true,
            last:false}
    );
    const[loadFailure,setLoadFailure]=useState(false);

    const pendingApiCall=useApiProgress("/api/1.0/users/page?");
    useEffect(()=>{
        loadUsers();
    },[])

   

    const loadUsers=async (page)=>{
        setLoadFailure(false);
        try{
            const response=await getAllUsers(page);
            setPage(response.data);
        }
        catch(error){
            setLoadFailure(true);
        }
      
            
    }
    const onClickNext=()=>{
        const nextPage=page.number+1;
        loadUsers(nextPage);
    }

  const  onClickPrevious=()=>{
        const previousPage=page.number-1;
        loadUsers(previousPage);
    }    
    
      const {content:users,first,last}=page;
      let actionDiv=<div>
      {first===false && <button className="btn-sm btn-light" onClick={onClickPrevious}>Previous</button>}
      {last===false &&<button className="btn-sm btn-light float-end" onClick={onClickNext}>Next</button>}
      </div>
      if(pendingApiCall){
          actionDiv=<div className="spinner-border">
          <span className="visually-hidden">Loading... </span>
        </div>
      }
      return (
            <div className="card">
               <h3 className="card-header text-center">Users</h3>
               <div className="list-group-flush">
               {users.map((user,index)=>{
                   return(<UserListItem key={user.username} user={user}/>)
               }
               )}
               </div>
               {actionDiv}
               {loadFailure && <div className="text-center text-danger">Load Failure </div>}
             
               
            </div>
            
        );
}


export default UserList;