

/**
 * A unit such as ``cm^2`` consists of a symbol ``m``, an exponent ``2``, and a prefix ``centi`` whose log evaluate to ``-2``
 */
export type TUnit = {
    symbol: string,
    logPrefix: number,
    exponent: number,
}
/**
 * The relation data structure allows for units to be composed together and, therefore, allows a unit to be expressed in terms of fundamental entities (mass, length, time,...)
 * 
 * e.g ``1 knot = 1.852 km/h``
 * 
 * - The coefficient field captures the value "``1.852``".
 * - The units field will capture the '``knot``' composition: 
 * ```
 * [
 *      {symbol: m, exponent: 1, logPrefix: 3}, 
 *      {symbol: h, exponent: -1, logPrefix: 0}
 * ]
 * ```
 */
export type TRelation = {
    coefficient: number,
    units: TUnit[]
}

/**
 * The Unit definition allows the definition of a unit in terms of other existing ones via its theoretical definition.
 * e.g. 1 Newton is theoreticaly defined as being:
 * ```
 *      1 N = 1 kg.m/s^2
 * ``` 
 */
export type TUnitDefinition = {
    symbol: string,
    theoreticalRelation: TRelation,
}
/**
 * The Unit description provides some more information/metadata about a unit identified by its symbol.
 * e.g. 1 Newton = 1 kg.m/s^2 
 */
export type TUnitDescription = {
    symbol: string,
    name: string,
    description: string
}


/**
 * Map unit symbols to their corresponding definitions
 */
export type TDefinitionRepository = { [key: string]: TUnitDefinition }
/**
 * Map unit symbols to their corresponding descriptions
 */
export type TDescriptionRepository = { [key: string]: TUnitDescription }