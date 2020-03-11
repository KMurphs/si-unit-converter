import { TUnit, TSuffix, TDimension } from "../app.controller/app.types";
import { SISuffix } from "../app.controller/app.native.data";










const buildMathJaxUnits = (units: TUnit[], addParenthesis: boolean, getSuffixByValue: (suff: SISuffix)=>TSuffix):string => {
  let num: string = ''
  let den: string = ''
  units.forEach(unit => {
    unit.exponent >= 0 && (num = num + buildMathJaxUnit(unit.symbol, getSuffixByValue(unit.suffix/unit.exponent), unit.exponent, addParenthesis));
    unit.exponent < 0 &&  (den = den + buildMathJaxUnit(unit.symbol, getSuffixByValue(unit.suffix/unit.exponent), unit.exponent, addParenthesis));
  })
  // return `(${num === '' ? '1' : num})${den === '' ? '' : `/(${den})`}`
  return `${den === '' ? `${num === '' ? '1' : num}` : `(${num === '' ? '1' : num})/(${den})`}`
}

const buildMathJaxUnit = (unitSymbol: string, unitSuffix: TSuffix, unitExponent: number, addParenthesis: boolean):string => {
  
  // let suffix = unit.suffix && SISuffix[unit.suffix] !== SISuffix[SISuffix.UNITY] ? nativeData.getSuffixObject(unit.suffix).symbol  : ''
  let suffix = unitSuffix.symbol
  let exp = Math.abs(unitExponent) === 1 ? '' : `^${Math.abs(unitExponent)}`
  let tmp = ''
  unitExponent >= 0 && (tmp = tmp + `${addParenthesis?'(':''}${suffix}\\${unitSymbol}${addParenthesis?')':''}${exp}`);
  unitExponent < 0 &&  (tmp = tmp + `${addParenthesis?'(':''}${suffix}\\${unitSymbol}${addParenthesis?')':''}${exp}`);

  return tmp
}













const buildMathJaxDimensions = (dimensions: TDimension[], addParenthesis: boolean):string => {
  let num: string = ''
  let den: string = ''
  dimensions.forEach(dim => {
    dim.exponent >= 0 && (num = num + buildMathJaxDimension(dim.symbol, dim.exponent, addParenthesis));
    dim.exponent < 0 &&  (den = den + buildMathJaxDimension(dim.symbol, dim.exponent, addParenthesis));
  })
  return `${den === '' ? `${num === '' ? '1' : num}` : `(${num === '' ? '1' : num})/(${den})`}`
}

const buildMathJaxDimension = (dimensionSymbol: string, dimensionExponent: number, addParenthesis: boolean):string => {
  
  let exp = Math.abs(dimensionExponent) === 1 ? '' : `^${Math.abs(dimensionExponent)}`
  let tmp = ''
  dimensionExponent >= 0 && (tmp = tmp + `${addParenthesis?'(':''}\\${dimensionSymbol}${exp}${addParenthesis?')':''}`);
  dimensionExponent < 0 &&  (tmp = tmp + `${addParenthesis?'(':''}\\${dimensionSymbol}${exp}${addParenthesis?')':''}`);

  return tmp
}
const toCapital = (str: string): string => str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase()



export {buildMathJaxUnits, buildMathJaxUnit, buildMathJaxDimensions, toCapital}