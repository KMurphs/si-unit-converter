

export type TUnit = {
    symbol: string,
    logPrefix: number,
    exponent: number,
}

export type TRelation = {
    coefficient: number,
    units: TUnit[]
}

export type TUnitDefinition = {
    symbol: string,
    name: string,
    theoreticalRelation: TRelation,
}

export type TDefinitionRepository = { [key: string]: TUnitDefinition }
export type TDescriptionRepository = { [key: string]: string }