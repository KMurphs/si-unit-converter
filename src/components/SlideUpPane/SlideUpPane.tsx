import React, { useState } from 'react';

import "./SlideUpPane.css"

type TProps = {
  state: boolean,
  onClose: ()=>void,
  extraClasses?: string,
}
const SlideUpPane: React.FC<TProps> = ({children, state, onClose, extraClasses}) => {



  return (
    <div className={`bottom-pane ${state?'bottom-pane--visible':''}`}>
      <div className="bottom-pane-inner">
        <label className="bottom-pane-close" htmlFor="bottom-pane-close"><i className="fas fa-times"></i><input type="checkbox" id="bottom-pane-close" checked={state} onChange={evt=>onClose()}/></label>
        {children}
      </div>
    </div>
  )

}


SlideUpPane.defaultProps = {
  extraClasses: ""
}
export default SlideUpPane









type TProps1 = {
  onNext: ()=>void,
  onPrevious: ()=>void,
  extraClasses?: string,
}
const UpDownInputContainer: React.FC<TProps1> = ({children, onNext, onPrevious, extraClasses}) => {

  return (
    <div className={`up-down-input-component up-down-input-component--container ${extraClasses}`} > {/*style={{width: `${children.toString().length+1}rem`}}>*/}

      <div className="up-down-input-control" onClick={evt=>onNext()}><i className="fas fa-caret-up"></i></div>
      <div className="up-down-input-value">
        {children}
      </div>
      <div className="up-down-input-control" onClick={evt=>onPrevious()}><i className="fas fa-caret-down"></i></div>

    </div>
  )

}


UpDownInputContainer.defaultProps = {
  extraClasses: ""
}

export {UpDownInputContainer}