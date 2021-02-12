/**
 * An enumeration of prefixes to be used by the application and the user interface.
 */
export enum Prefix {
    KILO = "k",
    HECTO = "h",
    DECA = "da",
    UNIT = "1",
    DECI = "d",
}


/**
 * Data structure representing a prefix.
 * - It has name (e.g. ``Mega``)
 * - A symbol (e.g. ``M``)
 * - A value (e.g. ``10^6``) whose log is ``6``
 */
export type TPrefix = {
    name: string,
    symbol: string,
    log10: number
}


/**
 * A repository of prefixes to be used by the application and the user interface.
 */
const Repository: { [key: string]: TPrefix } = {
    "k":    { name: "kilo",     symbol: "k",     log10:  3 },
    "h":    { name: "hecto",    symbol: "h",     log10:  2 },
    "da":   { name: "deca",     symbol: "da",    log10:  1 },
    "1":    { name: "unit",     symbol: "",      log10:  0 },
    "d":    { name: "deci",     symbol: "d",     log10: -1 },
    "c":    { name: "centi",    symbol: "c",     log10: -2 },
}




/**
 * Given a prefix symbol (e.g. ``k`` or ``M``, return the corresponding object from the Prefix Repository.
 * 
 * If no such symbol exists it returns ``null``
 * 
 * @param  {Prefix} symbol: Symbol of the Prefix of interest
 * @returns {TPrefix | null}: The prefix object if found else null
 */
export function prefixFromSymbol( symbol: Prefix ): TPrefix | null {
    return (symbol in Repository) ? Repository[symbol] : null; 
} 


/**
 * Given a logarithmic value 'log10', this function returns the prefix that corresponds to ``10^log10``.
 * 
 * If no such symbol exists it returns null
 * 
 * @param  {number} log10: The logarithmic value of the prefix (e.g. ``6 for mega``, ``-3 for milli``)
 * @returns {TPrefix | null}: The prefix if found
 */
export function prefixFromLog( log10: number ): TPrefix | null  {
    const [prefix] = Object.values(Repository).filter((prefix: TPrefix) => prefix.log10 === log10);
    return prefix ? prefix : null; 
} 

/**
 * Given a logarithmic value 'log10', this function returns the prefix symbol that corresponds to ``10^log10``.
 * 
 * If no such symbol exists it returns ``10^log10``
 * 
 * @param  {number} log10: The logarithmic value of the prefix (e.g. ``6 for mega``, ``-3 for milli``)
 * @returns string: The symbol if found (e.g. ``M for log10 = 3``, ``p for log10 = -12``, ``10^5 for log10 = 5``
 */
export function prefixSymbolFromLog( log10: number ): string {
    const prefix = prefixFromLog(log10);
    return prefix ? prefix.symbol : `10^${log10}`; 
} 