import assert from "assert";
import { prefixFromLog } from "./prefixes";
import { TDefinitionRepository, TRelation, TUnit } from "./types";


const resolveToDimension = (definitionsRepo: TDefinitionRepository, relation: TRelation): TRelation => {
    const empty = { coefficient: 1, units: [] };
    if(relation.units.length === 0) return empty
    
    let acc: TRelation = empty;

    for(const unit of relation.units){
        if(!(unit.symbol in definitionsRepo)) acc = multiplyRelations(acc, { coefficient: 1, units: [unit] })
        else acc = multiplyRelations(acc, transformRelation(resolveToDimension(definitionsRepo, { coefficient: 1, units: [unit] }), unit.logPrefix, unit.exponent))
    }

    return acc;
}

const sortAndMerge = (arr1: any[], arr2: any[], compareFn: (a: any, b: any)=>number): any[] => {
    arr1.sort(compareFn);
    arr2.sort(compareFn);
    
    const arr3 = [];

    let i1 = 0, i2 = 0;
    while (i1 < arr1.length && i2 < arr2.length) arr3.push(compareFn(arr1[i1], arr2[i2]) > 0 ? arr1[i1++] : arr2[i2++]);
    while (i1 < arr1.length) arr3.push(arr1[i1++]);
    while (i2 < arr2.length) arr3.push(arr2[i2++]);

    return arr3;
}

type TUnitAccumulation = { [key: string]: TUnit }
const mergeUnits = (acc: TUnitAccumulation, b: TUnit) => {
    if(!(b.symbol in acc)) acc[b.symbol] = { symbol: b.symbol, exponent: 0, logPrefix: 0 };
    const { symbol, logPrefix, exponent } = acc[b.symbol];
    acc[b.symbol] = { symbol: symbol, exponent: exponent + b.exponent, logPrefix: logPrefix + (b.logPrefix * b.exponent) };
    return acc;
}

const multiplyRelations = (relation1: TRelation, relation2: TRelation): TRelation => {
    const units = sortAndMerge(relation1.units, relation2.units, (a: TUnit, b: TUnit) => ("" + a.symbol).localeCompare(b.symbol) === 0 ? a.exponent - b.exponent : ("" + a.symbol).localeCompare(b.symbol))
    return {
        coefficient: relation1.coefficient * relation2.coefficient,
        units: Object(units.reduce(mergeUnits, {})).values().filter((unit: TUnit) => unit.exponent !== 0)
    };
}


const definitionsRepository: TDefinitionRepository = {}
const resolveToDimensionWithRepo = resolveToDimension.bind(null, definitionsRepository);

const transformRelation = (relation: TRelation, logPrefix: number, exponent: number): TRelation => {
    return {
        coefficient: relation.coefficient * (10 ^ (logPrefix * exponent)),
        units: relation.units.map(unit=> ({ symbol: unit.symbol, logPrefix: unit.logPrefix + exponent, exponent: unit.exponent * exponent }))
    }
}

const unitToString = ({symbol, exponent, logPrefix}: TUnit) => (exponent < 0 ? "1/" : "") + `${prefixFromLog(logPrefix)}${symbol}^${Math.abs(exponent)}` 
const relationToString = (units: TUnit[]): string => {
    return units.reduce((acc, unit) => acc + unitToString(unit), "");
}

const convertRelation = (src: TRelation, dst: TRelation): number => {
    
    const srcDim = resolveToDimensionWithRepo(src);
    const dstDim = resolveToDimensionWithRepo(dst);

    assert(multiplyRelations(srcDim, transformRelation(dstDim, 0, -1)).units.length === 0, `Cannot Convert between dimensions '${relationToString(src.units)}' and '${relationToString(dst.units)}'`);
    
    return dstDim.coefficient/srcDim.coefficient;
}