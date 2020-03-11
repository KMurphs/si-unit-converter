import React, { useState, useRef, useEffect } from 'react';

import "./SIUnitEditor.css"
import UpDownInput, { UpDownInputContainer } from '../UpDownInput/UpDownInput';
import { TSIValue, TUnit, TOpUnit, TSuffix, TUnitDefinition, TSuffixUtils, TUnitDefinitionUtils } from '../../app.controller/app.types';
import { SISuffix } from '../../app.controller/app.native.data';
import { buildMathJaxUnit } from '../mathjax.utils';

type TProps = {
  siunit: TUnit,
  onChange: (newVal: TUnit)=>void,
  suffixUtils: TSuffixUtils,
  mustShowParenthesis: boolean,
  unitDefUtils: TUnitDefinitionUtils,
  extraClasses?: string,
}
const SIUnitEditor: React.FC<TProps> = ({siunit, onChange, extraClasses, suffixUtils, unitDefUtils, mustShowParenthesis}) => {
  
  let pRef1 = useRef<any>()
  useEffect(() => {
    let mathjaxexpression = buildMathJaxUnit(siunit.symbol, suffixUtils.getByValue(siunit.suffix/siunit.exponent), siunit.exponent, mustShowParenthesis);
    siunit.exponent < 0 && (mathjaxexpression = `(1)/(${mathjaxexpression})`)
    pRef1.current && (pRef1.current.innerHTML = `\`${mathjaxexpression}\``);
    window.MathJax && window.MathJax.typeset && window.MathJax.typeset()
  });
  

  const handleNewSuffix = (siunit: TUnit, suffix: SISuffix)=>{
    siunit.suffix = suffix 
    onChange(siunit)
  }
  const handleNewUnit = (siunit: TUnit, symbol: string)=>{
    siunit.suffix = siunit.suffix/siunit.exponent 
    siunit.symbol = symbol 
    onChange(siunit)
  }
  const handleNewExponent = (siunit: TUnit, exponent: number)=>{
    siunit.suffix = siunit.suffix/siunit.exponent;
    if(exponent === 0){
      if(siunit.exponent < exponent){ siunit.exponent = 1; }
      else { siunit.exponent = -1; } 
    } else { 
      siunit.exponent = exponent; 
    }
    onChange(siunit)
  }
  const toCapital = (str: string): string => str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase()

  return (
    <div className={`si-unit-editor ${extraClasses}`}>

        <div className="si-unit-mathjax" ref={pRef1}></div>
            
        <div className="si-unit-container">
            <UpDownInputContainer onNext={()=>handleNewSuffix(siunit, suffixUtils.getNext(siunit.suffix/siunit.exponent).exponentOf10)} 
                                  onPrevious={()=>handleNewSuffix(siunit, suffixUtils.getPrevious(siunit.suffix/siunit.exponent).exponentOf10)} 
            >
                <p className={`${siunit.suffix/siunit.exponent === 0 ? 'text-transparent' : ''}`}>
                  {
                      siunit.suffix/siunit.exponent > 3 
                      ? toCapital(SISuffix[siunit.suffix/siunit.exponent]) 
                      : SISuffix[siunit.suffix/siunit.exponent].toLowerCase() 
                  }
                </p>

            </UpDownInputContainer>


            <div className="si-unit-separator"></div>
            
            
            <UpDownInputContainer onNext={()=>handleNewUnit(siunit, unitDefUtils.getNext(siunit.symbol).symbol)}
                                  onPrevious={()=>handleNewUnit(siunit, unitDefUtils.getPrevious(siunit.symbol).symbol)}
            >
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