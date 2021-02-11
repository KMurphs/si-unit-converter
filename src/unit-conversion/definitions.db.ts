import { Prefix, prefixFromSymbol, prefixSymbolFromLog } from "./prefixes";
import { TDefinitionRepository, TRelation, TUnitDefinition, TDescriptionRepository, TUnitDescription } from "./types";

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
export const isUnitSymbolInRepo = (symbol: string) => getDefinitionBySymbolFromRepo(definitionsRepository, symbol) ? true : false;


/**
 * Binds a funct.
 * @param  {string} symbol: Symbol for the unit
 */
export const bindToDefinitionsRepo = (f: Function) => f.bind(definitionsRepository);




/**
 * Utility to ease the creation of a new Relation defining some new custom unit.
 * - Instantiate the class with a possible ``coefficient`` of proportionality
 * - Add units involved in the relation (unit ``symbol, prefix and exponent``)
 * - Call the ``getRelation`` method to consume the relation
 */
export class Relation {
    relation: TRelation;
    constructor(coefficient: number = 1) {
        this.relation = { coefficient, units: [] };
    }
    
    /**
     * Add a unit object (e.g. 1kg or s^-2) to a relation defining a new custom unit (e.g. N)
     * @param  {string} symbol (e.g. 'g')
     * @param  {Prefix=Prefix.UNIT} prefix (e.g. 'k')
     * @param  {number=1} exponent (e.g. '1')
     * 
     * @return {Relation} returns the class instance (allowing chaining)
     */
    addUnit(symbol: string, prefix?: Prefix, exponent: number = 1){
        const safePrefix = prefix || Prefix.UNIT;
        if(!isUnitSymbolInRepo(symbol)) throw new Error("Unknown unit with symbol '" + symbol + "'");
        if(!prefixFromSymbol(safePrefix)) throw new Error("Unknown prefix with symbol '" + prefix + "'");

        this.relation.units.push({symbol, logPrefix: prefixFromSymbol(safePrefix)?.log10 || 0, exponent});
        return this;
    }
    
    /**
     * Consume the relation created
     * @return {Relation} returns the relation object
     */
    getRelation() { return this.relation }
}