import { TUnit, TSuffix } from "../app.controller/app.types";

// const buildMathJaxUnits = (units: TOperationalUnit[], addParenthesis: boolean):string => {
//   let num: string = ''
//   let den: string = ''
//   units.forEach(unit => {
//     unit.exponent >= 0 && (num = num + buildMathJaxUnit(unit, addParenthesis));
//     unit.exponent < 0 &&  (den = den + buildMathJaxUnit(unit, addParenthesis));
//   })
//   return `(${num === '' ? '1' : num})${den === '' ? '' : `/(${den})`}`
// }

const buildMathJaxUnit = (unitSymbol: string, unitSuffix: TSuffix, unitExponent: number, addParenthesis: boolean):string => {
  
  // let suffix = unit.suffix && SISuffix[unit.suffix] !== SISuffix[SISuffix.UNITY] ? nativeData.getSuffixObject(unit.suffix).symbol  : ''
  let suffix = unitSuffix.symbol
  let exp = Math.abs(unitExponent) === 1 ? '' : `^${Math.abs(unitExponent)}`
  let tmp = ''
  unitExponent >= 0 && (tmp = tmp + `${addParenthesis?'(':''}${suffix}\\${unitSymbol}${addParenthesis?')':''}${exp}`);
  unitExponent < 0 &&  (tmp = tmp + `${addParenthesis?'(':''}${suffix}\\${unitSymbol}${addParenthesis?')':''}${exp}`);

  return tmp
}
export {buildMathJaxUnit}
// export {buildMathJaxUnits, buildMathJaxUnit}