import { AssertionError } from "assert";
import { convertRelation, haveIdenticalDimensions, resolveToDimension } from ".";
import { addDefinition, Relation, getDefinitionBySymbol } from "./definitions.db";
import { Prefix } from "./prefixes";


const fundamentalUnits = [
    {symbol: "g", name: "gram", description: "Measures Mass"},
    {symbol: "s", name: "second", description: "Measures Time"},
    {symbol: "m", name: "meter", description: "Measures Distance"},
]
// const invalidUnits = [
//     {symbol: "x", name: "invalid", description: "Measures Nothing. It's not a valid unit"},
// ]

beforeAll(() => {
    fundamentalUnits.forEach(({name, symbol, description}) => addDefinition(symbol, name, new Relation(), description));
});

describe("Can Resolve Definitions", ()=>{

    it("Properly resolve Fundamental Definitions", ()=>{
        fundamentalUnits.forEach(({name, symbol, description}) => {
            const relation = resolveToDimension(new Relation().addUnit(symbol).getRelation());

            expect(relation.coefficient).toBe(1);
            expect(relation.units.length).toBe(1);
            expect(relation.units[0].symbol).toBe(symbol);
            expect(relation.units[0].exponent).toBe(1);
            expect(relation.units[0].logPrefix).toBe(0);

            expect(haveIdenticalDimensions(relation, new Relation().addUnit(symbol).getRelation())).toBe(true);
            expect(haveIdenticalDimensions(relation, new Relation().addUnit(symbol, Prefix.KILO).getRelation())).toBe(true);
            expect(haveIdenticalDimensions(relation, new Relation().addUnit(symbol, Prefix.KILO, 1).getRelation())).toBe(true);
            expect(haveIdenticalDimensions(relation, new Relation().addUnit(symbol, Prefix.KILO, 1000).addUnit(symbol, Prefix.KILO, -900).addUnit(symbol, Prefix.KILO, -99).getRelation())).toBe(true);
            
            // Treat unknown units as fundamental ones
            expect(haveIdenticalDimensions(relation, new Relation().addUnit("x", Prefix.KILO, 1000).addUnit("x", Prefix.KILO, -1000).addUnit(symbol, Prefix.KILO, 1).getRelation())).toBe(true);
            expect(haveIdenticalDimensions(relation, new Relation().addUnit("x", Prefix.KILO, 1000).addUnit("x", Prefix.KILO, -900).addUnit(symbol, Prefix.KILO, 100).addUnit(symbol, Prefix.KILO, -99).addUnit("x", Prefix.KILO, -99).addUnit("x", Prefix.KILO, -1).getRelation())).toBe(true);
        });
    })

    it("Resolves Custom Units To Dimension", ()=>{
        const newton = new Relation().addUnit("g", Prefix.KILO).addUnit("m").addUnit("s", Prefix.UNIT, -2);
        addDefinition("N", "Newton", newton, "Measures Force");

        const newtonAlt_1 = new Relation().addUnit("g", Prefix.DECA).addUnit("m", Prefix.HECTO).addUnit("s", Prefix.UNIT, -2);
        expect(haveIdenticalDimensions(newton.getRelation(), newtonAlt_1.getRelation())).toBe(true);
        expect(haveIdenticalDimensions(getDefinitionBySymbol("N").theoreticalRelation, newtonAlt_1.getRelation())).toBe(true);

        const newtonAlt_2 = new Relation().addUnit("g").addUnit("m", Prefix.KILO).addUnit("s", Prefix.UNIT, 2).addUnit("s", Prefix.UNIT, -4);
        expect(haveIdenticalDimensions(newton.getRelation(), newtonAlt_2.getRelation())).toBe(true);
        expect(haveIdenticalDimensions(getDefinitionBySymbol("N").theoreticalRelation, newtonAlt_2.getRelation())).toBe(true);
        
        const newtonAlt_3 = new Relation().addUnit("g").addUnit("m").addUnit("s", Prefix.UNIT, 2).addUnit("s", Prefix.UNIT, -4);
        expect(haveIdenticalDimensions(newton.getRelation(), newtonAlt_3.getRelation())).toBe(true);
        expect(haveIdenticalDimensions(getDefinitionBySymbol("N").theoreticalRelation, newtonAlt_3.getRelation())).toBe(true);
                
        const newtonAlt_4 = new Relation().addUnit("g", Prefix.UNIT, 1000000).addUnit("m", Prefix.UNIT).addUnit("s", Prefix.UNIT, 2).addUnit("g", Prefix.UNIT, -999999).addUnit("s", Prefix.UNIT, -4);
        expect(haveIdenticalDimensions(newton.getRelation(), newtonAlt_4.getRelation())).toBe(true);
        expect(haveIdenticalDimensions(getDefinitionBySymbol("N").theoreticalRelation, newtonAlt_4.getRelation())).toBe(true);
                        
        const newtonAlt_5 = new Relation().addUnit("N", Prefix.UNIT, -100).addUnit("g", Prefix.UNIT, 1000000).addUnit("m", Prefix.UNIT).addUnit("N", Prefix.UNIT, 100).addUnit("s", Prefix.UNIT, 2).addUnit("g", Prefix.UNIT, -999999).addUnit("s", Prefix.UNIT, -4);
        expect(haveIdenticalDimensions(newton.getRelation(), newtonAlt_5.getRelation())).toBe(true);
        expect(haveIdenticalDimensions(getDefinitionBySymbol("N").theoreticalRelation, newtonAlt_5.getRelation())).toBe(true);

    })

})



describe("Can Convert Between Units", ()=>{

    it("Resolves Custom Units To Dimension", ()=>{
        const newton = new Relation().addUnit("g", Prefix.KILO).addUnit("m").addUnit("s", Prefix.UNIT, -2);
        addDefinition("N", "Newton", newton, "Measures Force");


        expect(convertRelation(new Relation(2).addUnit("N").getRelation(), newton.getRelation())).toBe(2);
        expect(convertRelation(new Relation(2).addUnit("N").getRelation(), new Relation(2).addUnit("N").getRelation())).toBe(1);
        expect(convertRelation(new Relation(2).addUnit("N").getRelation(), new Relation(2).addUnit("N").getRelation())).toBe(1);
        expect(convertRelation(new Relation(2).addUnit("N").getRelation(), new Relation(1).addUnit("N").getRelation())).toBe(2);

        
        expect(convertRelation(new Relation(20).addUnit("N").getRelation(), new Relation(5).addUnit("g", Prefix.KILO).addUnit("m").addUnit("s", Prefix.UNIT, -2).getRelation())).toBe(4);

    })


    it("Handles incompatibles units", ()=>{
        expect(() => convertRelation(new Relation(20).addUnit("N").getRelation(), new Relation(5).addUnit("g", Prefix.KILO, 2).addUnit("m").addUnit("s", Prefix.UNIT, -2).getRelation())).toThrow(AssertionError);
    })
})