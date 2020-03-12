import React, { useState, useRef } from 'react';


import './SIUnitEditor.css';



type TProps = {
  onAdd: ()=>void
  extraClasses?: string
}
const AddSIUnitButton: React.FC<TProps> = ({children, onAdd, extraClasses}) => {




  return (
    <div className="si-unit-editor-add-unit" >
      <div className="si-unit-editor-add-button" onClick={evt=>onAdd()}>
        <i className="fas fa-plus"></i>
      </div>
      <p>Add Unit: </p>
      <div>
        {children}
      </div>
    </div>
  );


}
AddSIUnitButton.defaultProps = {
  extraClasses: ""
}
export default AddSIUnitButton;
