import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllHoaxes, getNewHoaxes, getNewHoaxesCount, getOldHoaxes } from '../api/ApiCalls';
import HoaxView from './HoaxView';
const HoaxFeed = () => {

    const [hoaxPage,setHoaxPage]=useState({content:[],last:false,number:0})
    const{username}=useParams();
    const[newHoaxCount,setNewHoaxCount]=useState(0);
    let firstHoaxId=0;
    if(hoaxPage.content.length>0){
        firstHoaxId=hoaxPage.content[0].id
    }
    
    
    const loadHoaxes=async (page,username)=>{
        try{
        const response=await getAllHoaxes(page,username);
        setHoaxPage(previousHoaxPage=>({ 
                ...response.data,
                
                content:[...previousHoaxPage.content,...response.data.content]}))
            

        } 
        
        catch(error){

        }
    }
    useEffect(()=>{
        
          loadHoaxes(0,username);
        
        },[username]);

    useEffect( ()=>{
        const getCount=async ()=>{
        const response=await getNewHoaxesCount(firstHoaxId,username);
       setNewHoaxCount(response.data.count); 
    }
    getCount();
    let looper=setInterval(()=>{
        getCount();
    },5000)
    return ()=>{ clearInterval(looper)};
    },[firstHoaxId,username])
    
    
    const loadOldHoaxes=async(username)=>{
        const lastHoaxIndex=hoaxPage.content.length-1;
        const lastHoaxId=hoaxPage.content[lastHoaxIndex].id;
        const response=await getOldHoaxes(username,lastHoaxId);
        setHoaxPage(previousHoaxPage=>({
            ...response.data,
            content:[...previousHoaxPage.content,...response.data.content]
        }));
    }
    
    const loadNewHoaxes=async(username)=>{
        const response=await getNewHoaxes(username,firstHoaxId);
    setHoaxPage((previousHoaxPage)=>({
        ...previousHoaxPage,
        content:[...response.data,...previousHoaxPage.content]
    }))        
     setNewHoaxCount(0);
    }

        const {content,last}=hoaxPage
    if(content.length===0){
        return (<div className="alert alert-secondary text-center">
               There are no hoaxes
               </div>)
    }

    const onDeleteSuccess=(id)=>{
        setHoaxPage((previousHoaxPage)=>({
            ...previousHoaxPage,
            content:previousHoaxPage.content.filter((hoax)=>{
                return hoax.id!==id;
            })
        }))      
    }
    
    return (
        <div>
            {newHoaxCount>0 && <div className="alert alert-secondary text-center mb-1" onClick={()=>{loadNewHoaxes(username)}}>
               There are new hoaxes
               </div>}
            {content.map((hoax)=>{return <HoaxView onDeleteSuccess={onDeleteSuccess} key={hoax.id} hoax={hoax}/>;
        }
        )
        }     
            {!last && <div className="alert alert-secondary text-center" onClick={()=>{loadOldHoaxes(username)}}>
               Load old Hoaxes
               </div>}
        </div>
    );
    
    }
export default HoaxFeed;

