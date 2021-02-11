import assert from "assert";
import { getDefinitionBySymbol, Relation } from "./definitions.db";
import { Prefix, prefixFromLog, prefixFromSymbol } from "./prefixes";
import { TUnit, TRelation } from "./types";


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
    acc[b.symbol] = { symbol: symbol, exponent: exponent + b.exponent, logPrefix: logPrefix * (b.logPrefix * b.exponent) };
    return acc;
}

const multiplyRelations = (relation1: TRelation, relation2: TRelation): TRelation => {
    const units = sortAndMerge(relation1.units, relation2.units, (a: TUnit, b: TUnit) => ("" + a.symbol).localeCompare(b.symbol) === 0 ? a.exponent - b.exponent : ("" + a.symbol).localeCompare(b.symbol))
    return {
        coefficient: relation1.coefficient * relation2.coefficient,
        units: (Object.values(units.reduce(mergeUnits, {})) as TUnit[]).filter(unit => (unit.exponent !== 0)) 
    };
}


const transformRelation = (relation: TRelation, logPrefix: number, exponent: number): TRelation => {
    return {
        coefficient: relation.coefficient * Math.pow(10, logPrefix * exponent),
        units: relation.units.map(unit=> ({ symbol: unit.symbol, logPrefix: unit.logPrefix * exponent, exponent: unit.exponent * exponent }))
    }
}

const unitToString = ({symbol, exponent, logPrefix}: TUnit) => (exponent < 0 ? "1/" : "") + `${prefixFromLog(logPrefix)}${symbol}^${Math.abs(exponent)}` 
const relationToString = (units: TUnit[]): string => {
    return units.reduce((acc, unit) => acc + unitToString(unit), "");
}










export const resolveToDimension = (relation: TRelation): TRelation => {
    if(relation.units.length === 0) return { coefficient: relation.coefficient, units: [] };
    
    let acc: TRelation = { coefficient: 1, units: [] };

    for(const unit of relation.units){
        const definition = getDefinitionBySymbol(unit.symbol);
        const prefix = prefixFromLog(unit.logPrefix)?.symbol;
        if(!definition) acc = multiplyRelations(acc, { coefficient: 1, units: [unit] });
        else {
            const resolution = resolveToDimension(definition.theoreticalRelation);
            const relation = resolution.units.length === 0 ? new Relation().addUnit(unit.symbol, prefix as Prefix, unit.exponent).getRelation() : resolution;
            acc = multiplyRelations(acc, transformRelation(relation, unit.logPrefix, unit.exponent));
        }
    }

    return acc;
}



export const convertRelation = (src: TRelation, dst: TRelation): number => {
    
    const srcDim = resolveToDimension(src);
    const dstDim = resolveToDimension(dst);

    assert(multiplyRelations(srcDim, transformRelation(dstDim, 0, -1)).units.length === 0, `Cannot Convert between dimensions '${relationToString(src.units)}' and '${relationToString(dst.units)}'`);
    
    return dstDim.coefficient/srcDim.coefficient;
}