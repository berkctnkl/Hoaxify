import React from 'react';

const Modal = (props) => {
  const{visible,title,message,onClickCancel,onClickOk,okButton}=props;
  let className="modal fade";
  if(visible){
    className+=" show d-block";
  }  
  return (
    <div className={className} style={{backgroundColor:"#000000b0"}}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{title}</h5>
          
      </div>
      <div className="modal-body">
        {message}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={onClickCancel}>Cancel</button>
        <button type="button" class="btn btn-danger" onClick={onClickOk}>{okButton}</button>
      </div>
    </div>
  </div>
</div>
    );
};

export default Modal;