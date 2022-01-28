import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { deleteUser, updateUser } from '../api/ApiCalls';
import { useSelector,useDispatch } from 'react-redux';
import Input from "./Input";
import ProfileImage from './ProfileImage';
import { logOutSuccess, updateSucess } from '../redux/authActions';
import Modal from './Modal';
import { useHistory } from 'react-router-dom';

const ProfileCard = (props) => {
    const [user, setUser] = useState({});
    const { username, displayName, image } = user;
    const { username: loggedInUsername } = useSelector(store => ({ username: store.username }));
    const[inEditMode,setInEditMode]=useState(false);    
    const[updatedDisplayName,setUpdatedDisplayName]=useState();
    const[editable,setEditable]=useState(false);
    const routeParams=useParams();
    const pathUsername=routeParams.username;
    const[newImage,setNewImage]=useState();
    const[validationExceptions,setValidationExceptions]=useState({});
    const[modalVisible,setModalVisible]=useState(false);
    const dispatch=useDispatch();
    const history=useHistory();
    
    useEffect(()=>{
      setEditable(pathUsername===loggedInUsername);  
    },[pathUsername,loggedInUsername])
    
    useEffect(()=>{
        setUser(props.user);
    },[props.user])


    useEffect(()=>{
        if(!inEditMode){
            setUpdatedDisplayName(undefined);
            setNewImage(undefined);
        }
        else{
            setUpdatedDisplayName(displayName);
        }
    },[inEditMode,displayName])
    
   useEffect(()=>{
    setValidationExceptions(previousValidationExceptions=>({
        ...previousValidationExceptions,
        displayName:undefined
       }))
   },[updatedDisplayName])

   useEffect(()=>{
       setValidationExceptions(previousValidationExceptions=>({
        ...previousValidationExceptions,
        image:undefined
       }))
   },[newImage]);

    const onClickSave= async ()=>{
        let image;
        if(newImage){
            image=newImage.split(",")[1];
        }
        const body={displayName:
            updatedDisplayName,
            image:image
        };
        try{
        const response=await updateUser(username,body);
        setUser(response.data);
        setInEditMode(false);
        dispatch(updateSucess(response.data));
    }
        catch(error){
            setValidationExceptions(error.response.data.validationExceptions)
        }
    
    }

    const onChangeFile=(event)=>{
        const file=event.target.files[0];
        const fileReader=new FileReader();
        fileReader.onloadend=()=>{
            setNewImage(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }

    const onClickCancel=()=>{
        setModalVisible(false);
    }

    const onClickDelete= async()=>{
        await deleteUser(username);
        setModalVisible(false);
        dispatch(logOutSuccess());
        history.push("/");
    }
    

    return (
        <div className="container">
        <div className="card text-center">
            <div className="card-header">
            <ProfileImage image={image} tempimage={newImage} className="rounded-circle shadow" width="200" height="200" alt={`${username} profile`}/>  
            </div>
            
            <div className="card-body">
            {!inEditMode && 
            <>
            <h3>
            {displayName}@{username}
            </h3>
            {editable && 
            <>
            <button className="btn btn-success d-inline-flex" onClick={()=>{setInEditMode(true);}}><span className="material-icons">edit</span> Edit</button>
            <div className="pt-2">
            <button className="btn btn-danger d-inline-flex" onClick={()=>{setModalVisible(true);}}><span className="material-icons">directions_run</span>Delete My Account</button>
            </div>
            
            </>
            }
            
            </>
            }
               
            {inEditMode && <> <Input label="Change Display Name" exception={validationExceptions.displayName}  onChange={(event)=>{setUpdatedDisplayName(event.target.value)}} defaultValue={displayName}/>
            <Input type="file" exception={validationExceptions.image} onChange={onChangeFile} />
            
            <div>
                <button className="btn btn-primary d-inline-flex" onClick={onClickSave}><span className="material-icons">save</span> Save</button>
                <button className="btn btn-light ms-2 d-inline-flex" onClick={()=>{setInEditMode(false);}}><span className="material-icons">close</span> Back</button>
            </div>
            </>
            }
            </div>
        </div>
        <Modal
        title="Delete My Account"
        visible={modalVisible}
        message="Are you sure to delete your account?"
        okButton="Delete My Account"
        onClickCancel={onClickCancel}
        onClickOk={onClickDelete}
        />
        </div>
    );
};

export default ProfileCard;