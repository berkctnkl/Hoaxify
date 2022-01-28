import React from 'react';
const ButtonWithProgress = (props) => {
    const{disabled,onClick,pendingApiCall,text}=props;
    
    return (
            <button className="btn btn-primary" type='submit' disabled={disabled} 
            onClick={onClick} >
                {pendingApiCall && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                        {text}
            </button>      
        
    );
}

export default ButtonWithProgress;      