import { addDefinition, getDefinitionBySymbol, getDefinitionByName, updateDefinition, deleteDefinitionBySymbol, Relation } from "./definitions.db";

const fundamentalUnits = [
    {symbol: "g", name: "gram", description: "Measures Mass (1)"},
    {symbol: "s", name: "second", description: "Measures Time (1)"},
    {symbol: "m", name: "meter", description: "Measures Distance (1)"},
]
const invalidUnits = [
    {symbol: "x", name: "invalid", description: "Measures Nothing. It's not a valid unit"},
]

describe("Can Manage Definitions", ()=>{

    it("Can Add and Find Definitions", ()=>{
        fundamentalUnits.forEach(({name, symbol, description}) => addDefinition(symbol, name, new Relation(), description));
        fundamentalUnits.forEach(({name, symbol, description}) => {
            const definition = getDefinitionBySymbol(symbol);

            expect(definition.symbol).toBe(symbol);
            expect(definition.name).toBe(name);
            expect(definition.description).toBe(description);
        });
    })

    it("Can Find Definitions By Name or Symbol", ()=>{
        fundamentalUnits.forEach(({name, symbol, description}) => {
            const definition = getDefinitionBySymbol(symbol);

            expect(definition.symbol).toBe(symbol);
            expect(definition.name).toBe(name);
            expect(definition.description).toBe(description);
        });
        fundamentalUnits.forEach(({name, symbol, description}) => {
            const definition = getDefinitionByName(name);

            expect(definition.symbol).toBe(symbol);
            expect(definition.name).toBe(name);
            expect(definition.description).toBe(description);
        });
    })


    it("Can Update Definitions", ()=>{
        fundamentalUnits.forEach(({name, symbol, description}) => updateDefinition(symbol, name, new Relation(), description.replace("(1)", "")));
        fundamentalUnits.forEach(({name, symbol, description}) => {
            const definition = getDefinitionBySymbol(symbol);

            expect(definition.symbol).toBe(symbol);
            expect(definition.name).toBe(name);
            expect(definition.description).toBe(description.replace("(1)", ""));
        });
    })


    it("Can Delete Definitions", ()=>{
        invalidUnits.forEach(({name, symbol, description}) => addDefinition(symbol, name, new Relation(), description));
        invalidUnits.forEach(({symbol}) => deleteDefinitionBySymbol(symbol));
        invalidUnits.forEach(({symbol}) => {
            const definition = getDefinitionBySymbol(symbol);

            expect(definition.symbol).toBe(undefined);
            expect(definition.name).toBe(undefined);
            expect(definition.description).toBe(undefined);
        });
    })

})




describe("Handles Empty Relations", () =>{

    it("Empty Relation Values", ()=>{
        fundamentalUnits.forEach(({name, symbol, description}) => addDefinition(symbol, name, new Relation(), description));
        fundamentalUnits.forEach(({symbol}) => {
            const { theoreticalRelation: relation } = getDefinitionBySymbol(symbol);

            expect(relation.coefficient).toBe(1);
            expect(relation.units.length).toBe(0);
        });
    })

})