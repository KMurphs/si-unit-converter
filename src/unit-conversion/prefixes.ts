export type TPrefix = {
    name: string,
    symbol: string,
    log10: number
}


const Prefix: { [key: string]: TPrefix} = {
    "hecto":    { name: "hecto",    symbol: "h",     log10:  2 },
    "deca":     { name: "deca",     symbol: "da",    log10:  1 },
    "unit":     { name: "unit",     symbol: "",      log10:  0 },
    "deci":     { name: "deci",     symbol: "d",     log10: -1 },
    "centi":    { name: "centi",    symbol: "c",     log10: -2 },
}
export default Prefix;


export function prefixFromLog( log10: number ): string {
    const [prefix] = Object(Prefix).values().filter((prefix: TPrefix) => prefix.log10 === log10);
    return prefix ? prefix.symbol : `10^${log10}`; 
} 