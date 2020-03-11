import React, { useState, useRef, useEffect } from 'react';

import "./Conversion.css"
import { TSIValue, TOpUnit, TSuffix } from '../../app.controller/app.types';
import { SISuffix } from '../../app.controller/app.native.data';
import { buildMathJaxUnits, buildMathJaxDimensions, round } from '../mathjax.utils';


type TProps = {
  initialValue: TSIValue,
  targetValue: TSIValue,
  initialUnits: TOpUnit,
  targetUnits: TOpUnit,
  mustShowParenthesis: boolean,
  getSuffix: (suff: SISuffix) => TSuffix
  extraClasses?: string,
}
const Conversion: React.FC<TProps> = ({initialValue, targetValue, extraClasses, initialUnits, targetUnits, getSuffix, mustShowParenthesis}) => {
  
  let pRef_start = useRef<any>()
  let pRef_equal = useRef<any>()
  let pRef_final = useRef<any>()
  let dRef_start = useRef<any>()
  let dRef_equal = useRef<any>()
  let dRef_final = useRef<any>()
  const dimensionsMatch = JSON.stringify(initialUnits.dimension) === JSON.stringify(targetUnits.dimension)
  useEffect(() => {

    pRef_start.current && (pRef_start.current.innerHTML = `\`${initialValue.mantisse}&nbsp;*&nbsp;10^(${initialValue.exponent})&nbsp;${buildMathJaxUnits(initialUnits.units, mustShowParenthesis, getSuffix)}\``);
    pRef_equal.current && (pRef_equal.current.innerHTML = `\`=\``);
    pRef_final.current && (pRef_final.current.innerHTML = `\`${round(targetValue.mantisse, 4)}&nbsp;*&nbsp;10^(${targetValue.exponent})&nbsp;${buildMathJaxUnits(targetUnits.units, mustShowParenthesis, getSuffix)}\``);

    window.MathJax && window.MathJax.typeset && window.MathJax.typeset()
  });
  useEffect(() => {

    dRef_start.current && (dRef_start.current.innerHTML = `\`${buildMathJaxDimensions(initialUnits.dimension, false)}\``);
    dRef_equal.current && (dRef_equal.current.innerHTML = `\`${dimensionsMatch ? '=' : '≠'}\``);
    dRef_final.current && (dRef_final.current.innerHTML = `\`${buildMathJaxDimensions(targetUnits.dimension, false)}\``);

    window.MathJax && window.MathJax.typeset && window.MathJax.typeset()
  });


  return (
    <div className={`si-conversion ${extraClasses}`}>

      <div className={`si-conversion-display`}>
        <div ref={pRef_start} className="mathjax-item"></div>
        <div ref={pRef_equal}></div>
        <div ref={pRef_final} className="mathjax-item"></div>
      </div>


      <div className="si-conversion-dimension-title">Dimensions</div>
      <div className={`si-conversion-dimension ${dimensionsMatch?'text-green-700':'text-red-800'}`}>
        <div ref={dRef_start} className="mathjax-item"></div>
        <div ref={dRef_equal}></div>
        <div ref={dRef_final} className="mathjax-item"></div>
      </div>
      <div className={`si-conversion-match`}>
        {
          !dimensionsMatch && (
            <p>Dimensions Do Not Match</p>
          )
        }
      </div>


    </div>
  )

}


Conversion.defaultProps = {
  extraClasses: ""
}
export default Conversion