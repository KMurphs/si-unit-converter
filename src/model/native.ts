import { TSuffix, TUnitDefinition, TUnitDefinitionComponent } from "./types";

export enum SISuffix {
  YOTTA = 24,
  ZETTA = 21,
  EXA = 18,
  PETA = 15,
  TERA = 12,
  GIGA = 9,
  MEGA = 6,
  KILO = 3,
  HECTO = 2,
  DECA = 1,
  UNITY = 0,
  DECI = -1,
  CENTI = -2,
  MILLI = -3,
  MICRO = -6,
  NANO = -9,
  PICO = -12,
  FENTO = -15,
}

export const nativeSuffixes: TSuffix[] = [
  { symbol: 'Y', name: SISuffix[SISuffix.YOTTA].toLowerCase(), exponentOf10: SISuffix.YOTTA },
  { symbol: 'Z', name: SISuffix[SISuffix.ZETTA].toLowerCase(), exponentOf10: SISuffix.ZETTA },
  { symbol: 'E', name: SISuffix[SISuffix.EXA].toLowerCase(), exponentOf10: SISuffix.EXA },
  { symbol: 'P', name: SISuffix[SISuffix.PETA].toLowerCase(), exponentOf10: SISuffix.PETA },
  { symbol: 'T', name: SISuffix[SISuffix.TERA].toLowerCase(), exponentOf10: SISuffix.TERA },
  { symbol: 'G', name: SISuffix[SISuffix.GIGA].toLowerCase(), exponentOf10: SISuffix.GIGA },
  { symbol: 'M', name: SISuffix[SISuffix.MEGA].toLowerCase(), exponentOf10: SISuffix.MEGA },
  { symbol: 'k', name: SISuffix[SISuffix.KILO].toLowerCase(), exponentOf10: SISuffix.KILO },
  { symbol: 'h', name: SISuffix[SISuffix.HECTO].toLowerCase(), exponentOf10: SISuffix.HECTO },
  { symbol: 'da', name: SISuffix[SISuffix.DECA].toLowerCase(), exponentOf10: SISuffix.DECA },
  { symbol: '', name: SISuffix[SISuffix.UNITY].toLowerCase(), exponentOf10: SISuffix.UNITY },
]






export const nativeUnitDefinitions: TUnitDefinition[] = [
  {
    name: 'meter',
    symbol: 'm',
    measurement: 'Length, Height',
    description: 'Measures Length',
    isBasicDimension: {
      value: true,
      symbol: 'L'
    },
    components: {
      factor: 1,
      units: []
    }
  },{
    name: 'second',
    measurement: 'Time',
    symbol: 's',
    description: 'Measures Time',
    isBasicDimension: {
      value: true,
      symbol: 'T'
    },
    components: {
      factor: 1,
      units: []
    }
  },{
    name: 'gram',
    measurement: 'Mass',
    symbol: 'g',
    description: 'Measures Mass',
    isBasicDimension: {
      value: true,
      symbol: 'M'
    },
    components: {
      factor: 1,
      units: []
    }
  }]