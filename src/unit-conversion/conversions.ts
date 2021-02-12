import assert from "assert";
import { fromUnitSymbol as getDefinitionFromUnitSymbol } from "./definitions.db";
import { prefixFromLog } from "./prefixes";
import { TUnit, TRelation } from "./types";




/**
 * Will sort 2 arrays of objects of type <T> and merge them in one sorted array.
 * (e.g. if used with units (<T> = <TUnit>) - ``g < N < N^2 < m < m^2 < m^3 < s,...``)
 * 
 * The function will return a new array containing the sorted objects.
 * 
 * The algorithm here follows closely the ``mergeSort`` algorithm's ``merge`` function. But does a pre-sorting of both input arrays 
 * (i.e. the function does not make the assumption that both input arrays are sorted)
 * 
 * @param  {T[]} arr1: Unsorted Array of objects of type <T>
 * @param  {T[]} arr2: Unsorted Array of objects of type <T>
 * @param  {(a:T, b:T) => number} compareFn: Function to compare 2 objects of type <T>
 * @returns {T[]}
 */
const sortAndMerge = <T>(arr1: T[], arr2: T[], compareFn: (a: T, b: T)=>number): T[] => {
    // Pre sort both arrays
    arr1.sort(compareFn);
    arr2.sort(compareFn);
    
    // Prepare container for resulting sorted array
    const arr3 = [];

    // mergeSort's merge algorithm: Take the next element in ascending order from array 1 or 2
    let i1 = 0, i2 = 0;
    while (i1 < arr1.length && i2 < arr2.length) arr3.push(compareFn(arr1[i1], arr2[i2]) > 0 ? arr1[i1++] : arr2[i2++]);
    while (i1 < arr1.length) arr3.push(arr1[i1++]);
    while (i2 < arr2.length) arr3.push(arr2[i2++]);

    return arr3;
}

type TUnitAccumulation = { [key: string]: TUnit }
/**
 * Utility function used with reduce to merge a unit object into an accumulated object.
 * 
 * @param  {TUnitAccumulation} acc
 * @param  {TUnit} b
 */
const mergeUnits = (acc: TUnitAccumulation, b: TUnit) => {
    // Ensure the current unit's symbol is always in the accumulator
    if(!(b.symbol in acc)) acc[b.symbol] = { symbol: b.symbol, exponent: 0, logPrefix: 0 };

    // Destructure accumulated unit with symbol "b.symbol"
    const { symbol, logPrefix, exponent } = acc[b.symbol];

    // Merge the current unit into the accumulator
    // ``m^2 and m -> m^3``, ``kg and (mg)^-2 -> (ng)^-1``
    acc[b.symbol] = { symbol, exponent: exponent + b.exponent, logPrefix: (logPrefix + (b.logPrefix * b.exponent))/(exponent + b.exponent) };
    
    // Return acc for the next cycle when used with reduce
    return acc;
}

/**
 * Multiply relations together: 
 *  - ``2 kg * 4km^2 -> 8 kg.km^2`` 
 *  - ``6 kg * 20 (mg)^-2 -> 120 (ng)^-1``
 * @param  {TRelation} relation1
 * @param  {TRelation} relation2
 * @returns {TRelation}
 */
const multiplyRelations = (relation1: TRelation, relation2: TRelation): TRelation => {
    // Sort and merge the input's units components
    const units = sortAndMerge(relation1.units, relation2.units, (a: TUnit, b: TUnit) => ("" + a.symbol).localeCompare(b.symbol) === 0 ? a.exponent - b.exponent : ("" + a.symbol).localeCompare(b.symbol))
    
    // Multiply the relations coefficient and units together
    return {
        // Coefficent can just be multiplied
        coefficient: relation1.coefficient * relation2.coefficient,
        // The units when multiplied must be merged together when they share the same symbol (e.g. ``km * cm^2`` -> ), in which
        // case, the resulting exponent and prefix must be re-evaluated - This is done by the reduce function
        // Also, exclude symbol whose merge results in a constant (i.e exponent has become 0)
        units: (Object.values(units.reduce(mergeUnits, {})) as TUnit[]).filter(unit => (unit.exponent !== 0)) 
    };
}

/**
 * When A unit is resolved to its dimensions, the resolved dimensions must also take the original unit's exponent and prefix.
 * 
 * @param  {TRelation} relation: Expressing the dimensions of the original unit
 * @param  {number} logPrefix: Prefix of original unit
 * @param  {number} exponent: Exponent of original unit
 * @returns TRelation: Updated Relation expressing the dimensions of the original unit and its exponent and prefix
 */
const transformRelation = (relation: TRelation, logPrefix: number, exponent: number): TRelation => {
    return {
        // The coefficient of the resolved dimension must take the prefix and exponent of the original unit
        coefficient: relation.coefficient * Math.pow(10, logPrefix * exponent),
        // Update the units to take the exponent of the original unit
        units: relation.units.map(unit=> ({ symbol: unit.symbol, logPrefix: unit.logPrefix * exponent, exponent: unit.exponent * exponent }))
    }
}
/**
 * Returns a string expressing the unit as a string
 * @param  {TUnit}
 */
const unitToString = ({symbol, exponent, logPrefix}: TUnit) => (exponent < 0 ? "1/" : "") + `${prefixFromLog(logPrefix)}${symbol}^${Math.abs(exponent)}` 
/**
 * Returns a string expressing the relation as a string
 * @param  {TUnit[]}
 */
const relationToString = (units: TUnit[]): string => {
    return units.reduce((acc, unit) => acc + unitToString(unit), "");
}
/**
 * Resolve two relations to their respective dimensions and return true if these are the same
 * @param  {TRelation} rel1
 * @param  {TRelation} rel2
 * @returns {boolean}
 */
export const haveSameDimensions = (rel1: TRelation, rel2: TRelation) => multiplyRelations(rel1, transformRelation(rel2, 0, -1)).units.length === 0







/**
 * Resolves a relation to its dimension i.e. in terms of fundamental units
 * @param  {TRelation} relation
 * @returns {TRelation} dimensions
 */
export const getDimensions = (relation: TRelation): TRelation => {
    
    // Handle the case of unknown and fundamental units
    if(!relation || !relation.units || relation.units.length === 0) return { coefficient: 1, units: [] };
    
    // Aggregate the units dimensions
    return relation.units.reduce(
        (acc, unit) => {

            // Try resolving the current units dimension
            const computedDimension = getDimensions(getDefinitionFromUnitSymbol(unit.symbol).theoreticalRelation);
            
            // In case this unit is unknown or fundamental, update the previously computed dimension to include the unit 
            const dimension = computedDimension.units.length === 0 ? { coefficient: 1, units: [unit] } : computedDimension;
            
            // Aggregate the dimensions, taking into account possible exponents
            return multiplyRelations(acc, transformRelation(dimension, unit.logPrefix, unit.exponent));
        }, 
        
        // Initial Object
        { coefficient: relation.coefficient, units: [] } as TRelation
    )
}


/**
 * Returns a coefficient ``c`` such that ``src = c * dst``
 * where src and dst are units/relation objects
 * 
 * e.g. 1km to m = 1000  
 * 
 * An error is thrown if both units/relations do not have the same dimensions
 * 
 * @param  {TRelation} src
 * @param  {TRelation} dst
 * @returns number
 */
export const fromSrcToDst = (src: TRelation, dst: TRelation): number => {
    
    const srcDim = getDimensions(src);
    const dstDim = getDimensions(dst);

    assert(haveSameDimensions(srcDim, dstDim), `Cannot Convert between dimensions '${relationToString(src.units)}' and '${relationToString(dst.units)}'`);
    
    return srcDim.coefficient/dstDim.coefficient;
}