import React from 'react';

import "./UpDownInput.css"

type TProps = {
  value: any,
  onChange: (newVal: string)=>void,
  onNext: ()=>void,
  onPrevious: ()=>void,
  isValueANumber?: boolean,
  extraClasses?: string,
}
const UpDownInput: React.FC<TProps> = ({children, value, isValueANumber, onNext, onPrevious, onChange, extraClasses}) => {

  // const willPotentiallyCacheThis: string = value.toString() 
  // const [cachedValue, setCachedValue] = useState<string|undefined>()
  

  return (
    <div className={`up-down-input-component ${extraClasses}`} style={{width: `${value.toString().length+2}rem`}}>

      <div className="up-down-input-control" onClick={evt=>onNext()}><i className="fas fa-caret-up"></i></div>
      <div className="up-down-input-value">
        {
          isValueANumber && (
            <input type="number" /*pattern="[+-]?[0-9]*[.,]?[0-9]*" value={cachedValue ? value : value} */
                                value={value}
                                onChange={(evt)=>{
                                  // if(!evt.target.value){
                                  //     setCachedValue(willPotentiallyCacheThis);
                                  //     onChange(willPotentiallyCacheThis.replace(".",","));
                                  // }else{
                                      // setCachedValue(undefined)
                                      // onChange(evt.target.value.replace(".",","));
                                      // evt.tar
                                      onChange(evt.target.value);
                                  // }
                                }} 
                                // onInput={evt=>{
                                //   const targetVal = (evt.target as HTMLInputElement).value
                                //   console.log(targetVal)
                                // }}
                                // onKeyPress={evt=>{
                                //   let targetVal = (evt.target as HTMLInputElement).value
                                //   console.log(evt)
                                //   console.log(evt.key)
                                //   evt.key === "" && ((evt.target as HTMLInputElement).value = value + ",")
                                //   // console.log(evt.target.)
                                  
                                //   console.log(targetVal)
                                //   targetVal.replace(".",",")
                                //   console.log(targetVal)
                                //   // onChange(targetVal)
                                // }}
            />
          )
        }
        {!isValueANumber && (<input type="text" value={value} onChange={evt=>onChange(evt.target.value)}/>)}
      </div>
      <div className="up-down-input-control" onClick={evt=>onPrevious()}><i className="fas fa-caret-down"></i></div>

    </div>
  )

}


UpDownInput.defaultProps = {
  isValueANumber: false,
  extraClasses: ""
}
export default UpDownInput









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