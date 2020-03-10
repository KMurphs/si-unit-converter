import React, { useState } from 'react';

import "./SIUnitEditor.css"
import UpDownInput, { UpDownInputContainer } from '../UpDownInput/UpDownInput';
import { TSIValue, TUnit, TOpUnit, TSuffix, TUnitDefinition, TSuffixUtils, TUnitDefinitionUtils } from '../../app.controller/app.types';
import { SISuffix } from '../../app.controller/app.native.data';

type TProps = {
  siunit: TUnit,
  onChange: (newVal: TUnit)=>void,
  suffixUtils: TSuffixUtils,
  unitDefUtils: TUnitDefinitionUtils,
  extraClasses?: string,
}
const SIUnitEditor: React.FC<TProps> = ({siunit, onChange, extraClasses, suffixUtils, unitDefUtils}) => {
  
  // const handleNewMantisse = (sivalue: TSIValue, mantisse: number)=>{
  //   sivalue.mantisse = mantisse
  //   onChange(sivalue)
  // }
  const handleNewSuffix = (siunit: TUnit, suffix: SISuffix)=>{
    siunit.suffix = suffix
    onChange(siunit)
  }
  const handleNewExponent = (siunit: TUnit, exponent: number)=>{
    siunit.exponent = exponent
    onChange(siunit)
  }
  const toCapital = (str: string): string => {
    return str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase()
  }
  return (
    <div className={`si-unit-editor ${extraClasses}`}>
            
        <div className="si-unit-container">
            <UpDownInputContainer onNext={()=>handleNewSuffix(siunit, suffixUtils.getNext(siunit.suffix/siunit.exponent).exponentOf10)} onPrevious={()=>{}} >
                 {toCapital(SISuffix[siunit.suffix/siunit.exponent])}
            </UpDownInputContainer>
        </div>
        <div className="si-unit-container">
            <UpDownInputContainer onNext={()=>{}} onPrevious={()=>{}} >
                 {siunit.symbol + " "}
            </UpDownInputContainer>
            <UpDownInput value={siunit.exponent} 
                        onChange={(val)=>handleNewExponent(siunit, parseFloat(val))} 
                        onNext={()=>handleNewExponent(siunit, siunit.exponent + 1)} 
                        onPrevious={()=>handleNewExponent(siunit, siunit.exponent - 1)} 
                        isValueANumber={true}
                        extraClasses="si-unit-exponent"
            />
        </div>




    </div>
  )

}


SIUnitEditor.defaultProps = {
  extraClasses: ""
}
export default SIUnitEditor