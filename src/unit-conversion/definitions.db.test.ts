import { conversions, definitions, Relation, Prefix } from ".";

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
        fundamentalUnits.forEach(({name, symbol, description}) => definitions.create(symbol, name, new Relation(), description));
        fundamentalUnits.forEach(({name, symbol, description}) => {
            const definition = definitions.fromUnitSymbol(symbol);

            expect(definition.symbol).toBe(symbol);
            expect(definition.name).toBe(name);
            expect(definition.description).toBe(description);
        });
    })

    it("Can Find Definitions By Name or Symbol", ()=>{
        fundamentalUnits.forEach(({name, symbol, description}) => {
            const definition = definitions.fromUnitSymbol(symbol);

            expect(definition.symbol).toBe(symbol);
            expect(definition.name).toBe(name);
            expect(definition.description).toBe(description);
        });
        fundamentalUnits.forEach(({name, symbol, description}) => {
            const definition = definitions.fromUnitName(name);

            expect(definition.symbol).toBe(symbol);
            expect(definition.name).toBe(name);
            expect(definition.description).toBe(description);
        });
    })


    it("Can Update Definitions", ()=>{
        fundamentalUnits.forEach(({name, symbol, description}) => definitions.update(symbol, name, new Relation(), description.replace("(1)", "")));
        fundamentalUnits.forEach(({name, symbol, description}) => {
            const definition = definitions.fromUnitSymbol(symbol);

            expect(definition.symbol).toBe(symbol);
            expect(definition.name).toBe(name);
            expect(definition.description).toBe(description.replace("(1)", ""));
        });
    })


    it("Can Delete Definitions", ()=>{
        invalidUnits.forEach(({name, symbol, description}) => definitions.create(symbol, name, new Relation(), description));
        invalidUnits.forEach(({symbol}) => definitions.deleteWithSymbol(symbol));
        invalidUnits.forEach(({symbol}) => {
            const definition = definitions.fromUnitSymbol(symbol);

            expect(definition.symbol).toBe(undefined);
            expect(definition.name).toBe(undefined);
            expect(definition.description).toBe(undefined);
        });
    })

})


describe("Allow Custom Units", () =>{

    it("Creates and Retrieves Custom Units", ()=>{
        const customUnits = [
            {symbol: "N", name: "Newton", relation: new Relation().withUnit("g", Prefix.KILO).withUnit("m").withUnit("s", Prefix.UNIT, -2), description: "Measures Force"},
            {symbol: "Pa", name: "Pascal", relation: new Relation().withUnit("N").withUnit("m", Prefix.UNIT, -2), description: "Measures Pressure"},
            {symbol: "Pa2", name: "Square Pascal", relation: new Relation().withUnit("Pa", Prefix.KILO, -2), description: "Measures Square Pressure"},
        ]
        customUnits.forEach(({name, symbol, description, relation}) => definitions.create(symbol, name, relation, description))
        customUnits.forEach(({name, symbol, description, relation}) => {
            const definition = definitions.fromUnitName(name);

            expect(definition.symbol).toBe(symbol);
            expect(definition.name).toBe(name);
            expect(definition.description).toBe(description);
            expect(conversions.haveSameDimensions(definition.theoreticalRelation, relation.toRelation())).toBe(true);
        })
    })


})

describe("Handles Edge Cases Relations", () =>{

    it("Handles Empty Relation Values", ()=>{
        fundamentalUnits.forEach(({name, symbol, description}) => definitions.create(symbol, name, new Relation(), description));
        fundamentalUnits.forEach(({symbol}) => {
            const { theoreticalRelation: relation } = definitions.fromUnitSymbol(symbol);

            expect(relation.coefficient).toBe(1);
            expect(relation.units.length).toBe(0);
        });
    })

    it("Handles 0, null or undefined coefficients in relations", ()=>{
        expect(() => new Relation(0).withUnit("m")).toThrow(Error);
        expect(conversions.haveSameDimensions(new Relation(undefined).withUnit("m").toRelation(), new Relation(1).withUnit("m").toRelation())).toBe(true);
    })
})