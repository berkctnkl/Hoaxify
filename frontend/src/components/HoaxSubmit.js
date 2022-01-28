import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { postHoax, postHoaxAttachment } from '../api/ApiCalls';
import ProfileImage from './ProfileImage';
import Input from './Input';
const HoaxSubmit = () => {
    const {image}=useSelector((store)=>{
        return {image:store.image,
                
        }
    });
    const[focused,setFocused]=useState(false);
    const[hoax,setHoax]=useState("");
    const[exceptions,setExceptions]=useState({});
    const[newImage,setNewImage]=useState();
    const [attachmentId,setAttachmentId]=useState();
    useEffect(()=>{
        if(!focused){
            setHoax("");
            setExceptions({});
            setNewImage();
            setAttachmentId(undefined);
        }
    },[focused]);

    const onChangeFile=(event)=>{
        const file=event.target.files[0];
        const fileReader=new FileReader();
        fileReader.onloadend=()=>{
            setNewImage(fileReader.result);
            uploadFile(file);
        };
        fileReader.readAsDataURL(file);
    }



    useEffect(()=>{
        setExceptions({});
    },[hoax])
    
    const uploadFile=async (file)=>{
        const attachment=new FormData();
        attachment.append("file",file);
        const response=await postHoaxAttachment(attachment);
        setAttachmentId(response.data.id);
    }

    const onClickHoaxify=async ()=>{
       const body={
            content:hoax,
            attachmentId:attachmentId
        }

        try{
            const response=await postHoax(body);
            setFocused(false);
        }
        catch(error){
            if(error.response.data.validationExceptions){
                setExceptions(
                    error.response.data.validationExceptions
                    );
                    
            }
            
        }
    }
    let textAreaClass="mb-1 form-control"
    if(exceptions.content){
        textAreaClass+=" is-invalid"
    }
    return (
        <div className="card p-1 flex-row">
            <ProfileImage className="rounded-circle me-1" image={image} width="32" height="32"/>
            <div className="flex-fill">
            <textarea className={textAreaClass} 
            rows={focused ? "3":"1"}
            onFocus={()=>{setFocused(true)}}
            onChange={(event)=>{setHoax(event.target.value)}}
            value={hoax}
            />
           
           <div className="invalid-feedback">{exceptions.content} </div>
           { focused && 
           <>
           <Input  type="file" onChange={(event)=>{onChangeFile(event)}}/>
           {newImage && <img className="mt-1 img-thumbnail" src={newImage} alt="hoax attachment"/>}
           <div className="text-end mt-1" >
                <button className="btn btn-primary" onClick={onClickHoaxify}>
                    Hoaxify
                </button>
                <button className="btn btn-light ms-2 d-inline-flex" onClick={()=>{setFocused(false)}}><span className="material-icons">close</span>Cancel</button>
            </div> 
            </>}
            </div>
            
        </div>
         
    );
}; 

export default HoaxSubmit;