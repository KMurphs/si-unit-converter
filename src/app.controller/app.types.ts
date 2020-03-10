import { SISuffix } from "./app.native.data"

export type TMeta = {
  author: string,
  timestamp: number
}


export type TSIValue = {
  mantisse: number,
  exponent: number
}


export type TUnitDefinition = {
  symbol: string,
  name: string,
  description: string,
  measurement: string,
  isBasicDimension: {
    value: boolean,
    symbol: string
  }
  components: TUnitDefinitionComponent
}


export type TUnitDefinitionComponent = {
  factor: number,
  units: TUnit[]
}

export type TUnit = {
  suffix: number,
  symbol: string,
  exponent: number
}
export type TDimension = {
  symbol: string,
  exponent: number
}
export type TOpUnit = {
  units: TUnit[],
  dimension: TDimension[]
  baseFactor: number
}



export type TRecord = {
  initialValue: TSIValue,
  initiatUnits: TOpUnit,
  targetValue: TSIValue,
  targetUnits: TOpUnit,
  meta: TMeta
}



export type TSuffix = {
  symbol: string,
  name: string,
  exponentOf10: number
}












export type TSuffixUtils = {
  getNext: (currSuff: SISuffix) => TSuffix
  getPrevious: (currSuff: SISuffix) => TSuffix
  getByValue: (currSuff: SISuffix) => TSuffix
}
export type TUnitDefinitionUtils = {
  getNext: (currSymbol: string) => TUnitDefinition
  getPrevious: (currSymbol: string) => TUnitDefinition
  getBySymbol: (currSymbol: string) => TUnitDefinition
}