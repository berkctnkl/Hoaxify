import React,{useState} from 'react';
import ProfileImage from "./ProfileImage";
import { Link } from 'react-router-dom';
import {format} from "timeago.js";
import { useSelector } from 'react-redux';
import { deleteHoax } from '../api/ApiCalls';
import Modal from './Modal';

const HoaxView = (props) => {
    const loggedInUser =useSelector(store=>store.username);
    const{hoax,onDeleteSuccess}=props;
    const{user,content,createDate,fileAttachment,id}=hoax;
    const{username,displayName,image}=user;
    const formattedDate=format(createDate);
    const ownedByLoggedInUser=username===loggedInUser;
    const[modalVisible,setModalVisible]=useState()
    
    const onClickDelete= async()=>{
        await deleteHoax(id);
        onDeleteSuccess(id);
        setModalVisible(false);
    }

    const onClickCancel=()=>{
      setModalVisible(false);
    }
    
    return (
        <>
        <div className="card p-1">
            <div className="d-flex">
            <ProfileImage className="rounded-circle m-1" image={image} width="32" height="32"/>
            <div className="flex-fill m-auto ps-2">
            <Link className="text-black text-decoration-none" to={`users/${username}`} >
            <h6 className= "d-inline">{displayName}@{username}</h6>   
            <span>-</span>
              <span>{formattedDate}</span> 
            </Link>
            </div>
            
            {ownedByLoggedInUser && <button className="btn btn-delete-link btn-sm" onClick={()=>{setModalVisible(true)}}><span className="material-icons">delete_outline</span></button>}
              </div>
            <div className="ps-5">{content}</div>
            {fileAttachment&& <div className="ps-5"><img  src={`images/${fileAttachment.name}`} className="img-fluid"/> </div>}
            
        </div>
        <Modal visible={modalVisible}
        title="Delete Hoax"
        okButton="Delete Hoax"
        message={<div>
          <strong>Are you sure to delete Hoax?</strong>
          <div>{content}</div>
        </div>}
        onClickCancel={onClickCancel}
        onClickOk={onClickDelete}
        />
        
        </>
    );
};

export default HoaxView;