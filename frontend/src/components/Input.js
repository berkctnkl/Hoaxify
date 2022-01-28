import React from 'react';
const Input=(props)=>{
    const{label,exception,name,type,onChange,defaultValue}=props;
    let className="form-control";
    if(type==="file"){
        className+="-file";
    }
    if(exception!==undefined){
        className+= " is-invalid";
    }

    return(
        <div className="form-group">
                   <label>{label}</label>     
                    <input className= {className} type={type} name={name} onChange={onChange} defaultValue={defaultValue}/>
                   <div className="invalid-feedback">{exception} </div>
            
                </div> 
    );
}
export default Input;