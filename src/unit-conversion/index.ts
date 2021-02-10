import assert from "assert";
import PrefixRepo, { Prefix, prefixFromLog, prefixFromSymbol, TPrefix } from "./prefixes";
import { TDefinitionRepository, TDescriptionRepository, TRelation, TUnit, TUnitDefinition, TUnitDescription } from "./types";




/**
 * CRUD Operation of Definition Repository
 */
let definitionsRepository: TDefinitionRepository = {}
const emptyDefinitionsRepository: TDefinitionRepository = {}
const addDefinitionInRepo = (definitionsRepo: TDefinitionRepository, symbol: string, relation: TRelation): TDefinitionRepository =>({...definitionsRepo, ...{[symbol]: {symbol, theoreticalRelation: relation}}});
const updateDefinitionInRepo = addDefinitionInRepo;
const getDefinitionBySymbolFromRepo = (definitionsRepo: TDefinitionRepository, symbol: string) => ({...definitionsRepo[symbol]});
const deleteDefinitionFromRepo  = (definitionsRepo: TDefinitionRepository, symbol: string) => Object.values(definitionsRepo).reduce((acc: TDefinitionRepository, def: TUnitDefinition) => ({...acc, ...(def.symbol === symbol ? {} : {[def.symbol]: def})}), emptyDefinitionsRepository);

/**
 * CRUD Operation of Description Repository
 */
let descriptionsRepository: TDescriptionRepository = {};
const emptyDescriptionRepository: TDescriptionRepository = {};
const addDescriptionInRepo = (descriptionsRepo: TDescriptionRepository, symbol: string, name: string, description: string): TDescriptionRepository =>({...descriptionsRepo, ...{[symbol]: {symbol, name, description}}});
const updateDescriptionInRepo = addDescriptionInRepo;
const getDescriptionBySymbolFromRepo = (descriptionsRepo: TDescriptionRepository, symbol: string) => ({...descriptionsRepo[symbol]});
const getDescriptionByNameFromRepo = (descriptionsRepo: TDescriptionRepository, name: string): TUnitDescription => Object.values(descriptionsRepo).filter((descr: TUnitDescription) => descr.name === name)[0];
const deleteDescriptionFromRepo  = (descriptionsRepo: TDescriptionRepository, symbol: string) => Object.values(descriptionsRepo).reduce((acc: TDescriptionRepository, def: TUnitDescription) => ({...acc, ...(def.symbol === symbol ? {} : {[def.symbol]: def})}), emptyDescriptionRepository);




/**
 * Add/Create a unit definition
 * @param  {string} symbol: Symbol for the unit being defined (e.g. N)
 * @param  {string} name: Name of the unit being defined (e.g. Newton)
 * @param  {string} description: Description of the unit being defined (e.g. Measures Force)
 * @param  {TRelation} relation: Theoretical relation that defines the unit in terms of existing units (e.g. 1N = 1 kg.m/s^2 )
 */
export const addDefinition = (symbol: string, name: string, theoreticalDefinition: Relation, description?: string) => {
    definitionsRepository = addDefinitionInRepo(definitionsRepository, symbol, theoreticalDefinition.getRelation());
    descriptionsRepository = addDescriptionInRepo(descriptionsRepository, symbol, name, description || "");
};
/**
 * Update a unit definition
 * @param  {string} symbol: Symbol for the unit being updated (e.g. N)
 * @param  {string} name: Name of the unit being defined (e.g. Newton)
 * @param  {string} description: Description of the unit being defined (e.g. Measures Force)
 * @param  {TRelation} relation: Theoretical relation that defines the unit in terms of existing units (e.g. 1N = 1 kg.m/s^2 )
 */
export const updateDefinition = addDefinition;
/**
 * Get a unit definition from the repository - using its symbol (e.g. N for Newton)
 * @param  {string} symbol: Symbol for the unit
 */
export const getDefinitionBySymbol = (symbol: string) => ({...getDefinitionBySymbolFromRepo(definitionsRepository, symbol), ...getDescriptionBySymbolFromRepo(descriptionsRepository, symbol)});
/**
 * Get a unit definition from the repository - using its name (e.g. Newton)
 * @param  {string} name: Name of the unit
 */
export const getDefinitionByName = (name: string) => getDefinitionBySymbol(getDescriptionByNameFromRepo(descriptionsRepository, name).symbol);
/**
 * Delete a unit definition from the repository - using its symbol (e.g. N for Newton)
 * @param  {string} name: Name of the unit
 */
export const deleteDefinitionBySymbol = (symbol: string) => {
    definitionsRepository = deleteDefinitionFromRepo(definitionsRepository, symbol);
    descriptionsRepository = deleteDescriptionFromRepo(descriptionsRepository, symbol);
};
/**
 * Determines whether a unit identified by its symbol is present in the unit repository.
 * @param  {string} symbol: Symbol for the unit
 */
const isUnitSymbolInRepo = (symbol: string) => getDefinitionBySymbolFromRepo(definitionsRepository, symbol) ? true : false;







export class Relation {
    relation: TRelation;
    constructor(coefficient: number = 1) {
        this.relation = { coefficient, units: [] };
    }
    addUnit(symbol: string, prefix: Prefix = Prefix.UNIT, exponent: number = 1){
        if(!isUnitSymbolInRepo(symbol)) throw new Error("Unknown unit with symbol '" + symbol + "'");
        if(!prefixFromSymbol(prefix)) throw new Error("Unknown prefix with symbol '" + prefix + "'");

        this.relation.units.push({symbol, logPrefix: prefixFromSymbol(prefix)?.log10 || 0, exponent});
        return this;
    }
    getRelation() { return this.relation }
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
        units: Object.values(units.reduce(mergeUnits, {})).filter((unit: TUnit) => (unit.exponent !== 0)) 
    };
}


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









export const resolveToDimension = (definitionsRepo: TDefinitionRepository, relation: TRelation): TRelation => {
    if(relation.units.length === 0) return { coefficient: relation.coefficient, units: [] };
    
    let acc: TRelation = { coefficient: 1, units: [] };;

    for(const unit of relation.units){
        if(!(unit.symbol in definitionsRepo)) acc = multiplyRelations(acc, { coefficient: 1, units: [unit] })
        else acc = multiplyRelations(acc, transformRelation(resolveToDimension(definitionsRepo, { coefficient: 1, units: [unit] }), unit.logPrefix, unit.exponent))
    }

    return acc;
}
const resolveToDimensionWithRepo = resolveToDimension.bind(null, definitionsRepository);



export const convertRelation = (src: TRelation, dst: TRelation): number => {
    
    const srcDim = resolveToDimensionWithRepo(src);
    const dstDim = resolveToDimensionWithRepo(dst);

    assert(multiplyRelations(srcDim, transformRelation(dstDim, 0, -1)).units.length === 0, `Cannot Convert between dimensions '${relationToString(src.units)}' and '${relationToString(dst.units)}'`);
    
    return dstDim.coefficient/srcDim.coefficient;
}