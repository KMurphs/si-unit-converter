import { haveIdenticalDimensions } from ".";
import { addDefinition, getDefinitionBySymbol, getDefinitionByName, updateDefinition, deleteDefinitionBySymbol, Relation } from "./definitions.db";
import { Prefix } from "./prefixes";

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


describe("Allow Custom Units", () =>{

    it("Creates and Retrieves Custom Units", ()=>{
        const customUnits = [
            {symbol: "N", name: "Newton", relation: new Relation().addUnit("g", Prefix.KILO).addUnit("m").addUnit("s", Prefix.UNIT, -2), description: "Measures Force"},
            {symbol: "Pa", name: "Pascal", relation: new Relation().addUnit("N").addUnit("m", Prefix.UNIT, -2), description: "Measures Pressure"},
            {symbol: "Pa2", name: "Square Pascal", relation: new Relation().addUnit("Pa", Prefix.KILO, -2), description: "Measures Sqaure Pressure"},
        ]
        customUnits.forEach(({name, symbol, description, relation}) => addDefinition(symbol, name, relation, description))
        customUnits.forEach(({name, symbol, description, relation}) => {
            const definition = getDefinitionByName(name);

            expect(definition.symbol).toBe(symbol);
            expect(definition.name).toBe(name);
            expect(definition.description).toBe(description);
            expect(haveIdenticalDimensions(definition.theoreticalRelation, relation.getRelation())).toBe(true);
        })
    })


})

describe("Handles Edge Cases Relations", () =>{

    it("Handles Empty Relation Values", ()=>{
        fundamentalUnits.forEach(({name, symbol, description}) => addDefinition(symbol, name, new Relation(), description));
        fundamentalUnits.forEach(({symbol}) => {
            const { theoreticalRelation: relation } = getDefinitionBySymbol(symbol);

            expect(relation.coefficient).toBe(1);
            expect(relation.units.length).toBe(0);
        });
    })

    it("Handles 0, null or undefined coefficients in relations", ()=>{
        expect(() => new Relation(0).addUnit("m")).toThrow(Error);
        expect(haveIdenticalDimensions(new Relation(undefined).addUnit("m").getRelation(), new Relation(1).addUnit("m").getRelation())).toBe(true);
    })
})