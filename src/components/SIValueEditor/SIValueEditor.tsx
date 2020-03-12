import React from 'react';

import "./SIValueEditor.css"
import UpDownInput from '../UpDownInput/UpDownInput';
import { TSIValue } from '../../app.controller/app.types';

type TProps = {
  sivalue: TSIValue,
  onChange: (newVal: TSIValue)=>void,
  extraClasses?: string,
}
const SIValueEditor: React.FC<TProps> = ({sivalue, onChange, extraClasses}) => {
  
  const handleNewMantisse = (sivalue: TSIValue, mantisse: number)=>{
    sivalue.mantisse = mantisse
    onChange(sivalue)
  }
  const handleNewExponent = (sivalue: TSIValue, exponent: number)=>{
    sivalue.exponent = exponent
    onChange(sivalue)
  }
  return (

    <div className="si-value-container">
      <div className="si-value-title"><h3>Enter the value to be converted</h3></div>
      <div className={`si-value-editor ${extraClasses}`}>

        
              
        <div className="si-value-mantisse">
          <UpDownInput value={sivalue.mantisse} 
                      onChange={(val)=>handleNewMantisse(sivalue, typeof val === "number" ? val : parseFloat(val))} 
                      onNext={()=>handleNewMantisse(sivalue, sivalue.mantisse+1)} 
                      onPrevious={()=>handleNewMantisse(sivalue, sivalue.mantisse-1)}
                      isValueANumber={true}
          />
        </div>
        <div className="fixed-text"><p>x 10</p> </div>
        <div className="si-value-exponent">
          <UpDownInput value={sivalue.exponent} 
                      onChange={(val)=>handleNewExponent(sivalue, typeof val === "number" ? val : parseFloat(val))} 
                      onNext={()=>handleNewExponent(sivalue, sivalue.exponent+1)} 
                      onPrevious={()=>handleNewExponent(sivalue, sivalue.exponent-1)}
                      isValueANumber={true}
          />
        </div>

      </div>
         
    </div>



  )

}


SIValueEditor.defaultProps = {
  extraClasses: ""
}
export default SIValueEditor