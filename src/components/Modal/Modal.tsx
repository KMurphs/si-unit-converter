import React, { useState, useRef } from 'react';


import './Modal.css';



type TProps = {
  isActive: boolean
  onDeactivate: ()=>void
  extraClasses?: string
}
const Modal: React.FC<TProps> = ({children, onDeactivate,isActive, extraClasses}) => {

  const [isChildVisible, setIsChildVisible] = useState<boolean>(false)
  let isChildActivated = useRef<boolean>(false)  
  if(isActive && !isChildActivated.current && !isChildVisible){
    isChildActivated.current = true
    setTimeout(()=>{
      setIsChildVisible(true)
    }, 300)     
  }


  return (
    <div className={`modal-container ${extraClasses} ${isActive?'modal-container--active':''}`}
          onClick={evt => {
            isChildActivated.current = false
            onDeactivate()
            setIsChildVisible(false)
            evt.stopPropagation()
          }}
    >
      <div className={`modal-children-container ${isChildVisible?'modal-children--visible':''}`} onClick={evt => evt.stopPropagation()}>
        {children}
      </div>
    </div>
  );


}
Modal.defaultProps = {
  extraClasses: ""
}
export default Modal;
