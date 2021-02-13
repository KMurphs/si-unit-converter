import { AssertionError } from "assert";
import { definitions, Prefix, Relation, conversions } from "."


const fundamentalUnits = [
    {symbol: "g", name: "gram", description: "Measures Mass"},
    {symbol: "s", name: "second", description: "Measures Time"},
    {symbol: "m", name: "meter", description: "Measures Distance"},
]
// const invalidUnits = [
//     {symbol: "x", name: "invalid", description: "Measures Nothing. It's not a valid unit"},
// ]

beforeAll(() => {
    fundamentalUnits.forEach(({name, symbol, description}) => definitions.create(symbol, name, new Relation(), description));
});

describe("Can Resolve Definitions", ()=>{

    it("Properly resolve Fundamental Definitions", ()=>{
        fundamentalUnits.forEach(({name, symbol, description}) => {
            const relation = conversions.getDimensions(new Relation().withUnit(symbol).toRelation());

            expect(relation.coefficient).toBe(1);
            expect(relation.units.length).toBe(1);
            expect(relation.units[0].symbol).toBe(symbol);
            expect(relation.units[0].exponent).toBe(1);
            expect(relation.units[0].logPrefix).toBe(0);

            expect(conversions.haveSameDimensions(relation, new Relation().withUnit(symbol).toRelation())).toBe(true);
            expect(conversions.haveSameDimensions(relation, new Relation().withUnit(symbol, Prefix.KILO).toRelation())).toBe(true);
            expect(conversions.haveSameDimensions(relation, new Relation().withUnit(symbol, Prefix.KILO, 1).toRelation())).toBe(true);
            expect(conversions.haveSameDimensions(relation, new Relation().withUnit(symbol, Prefix.KILO, 1000).withUnit(symbol, Prefix.KILO, -900).withUnit(symbol, Prefix.KILO, -99).toRelation())).toBe(true);
            
            // Treat unknown units as fundamental ones
            expect(conversions.haveSameDimensions(relation, new Relation().withUnit("x", Prefix.KILO, 1000).withUnit("x", Prefix.KILO, -1000).withUnit(symbol, Prefix.KILO, 1).toRelation())).toBe(true);
            expect(conversions.haveSameDimensions(relation, new Relation().withUnit("x", Prefix.KILO, 1000).withUnit("x", Prefix.KILO, -900).withUnit(symbol, Prefix.KILO, 100).withUnit(symbol, Prefix.KILO, -99).withUnit("x", Prefix.KILO, -99).withUnit("x", Prefix.KILO, -1).toRelation())).toBe(true);
        });
    })

    it("Resolves Custom Units To Dimension", ()=>{
        const newton = new Relation().withUnit("g", Prefix.KILO).withUnit("m").withUnit("s", Prefix.UNIT, -2);
        definitions.create("N", "Newton", newton, "Measures Force");

        const newtonAlt_1 = new Relation().withUnit("g", Prefix.DECA).withUnit("m", Prefix.HECTO).withUnit("s", Prefix.UNIT, -2);
        expect(conversions.haveSameDimensions(newton.toRelation(), newtonAlt_1.toRelation())).toBe(true);
        expect(conversions.haveSameDimensions(definitions.fromUnitSymbol("N").theoreticalRelation, newtonAlt_1.toRelation())).toBe(true);

        const newtonAlt_2 = new Relation().withUnit("g").withUnit("m", Prefix.KILO).withUnit("s", Prefix.UNIT, 2).withUnit("s", Prefix.UNIT, -4);
        expect(conversions.haveSameDimensions(newton.toRelation(), newtonAlt_2.toRelation())).toBe(true);
        expect(conversions.haveSameDimensions(definitions.fromUnitSymbol("N").theoreticalRelation, newtonAlt_2.toRelation())).toBe(true);
        
        const newtonAlt_3 = new Relation().withUnit("g").withUnit("m").withUnit("s", Prefix.UNIT, 2).withUnit("s", Prefix.UNIT, -4);
        expect(conversions.haveSameDimensions(newton.toRelation(), newtonAlt_3.toRelation())).toBe(true);
        expect(conversions.haveSameDimensions(definitions.fromUnitSymbol("N").theoreticalRelation, newtonAlt_3.toRelation())).toBe(true);
                
        const newtonAlt_4 = new Relation().withUnit("g", Prefix.UNIT, 1000000).withUnit("m", Prefix.UNIT).withUnit("s", Prefix.UNIT, 2).withUnit("g", Prefix.UNIT, -999999).withUnit("s", Prefix.UNIT, -4);
        expect(conversions.haveSameDimensions(newton.toRelation(), newtonAlt_4.toRelation())).toBe(true);
        expect(conversions.haveSameDimensions(definitions.fromUnitSymbol("N").theoreticalRelation, newtonAlt_4.toRelation())).toBe(true);
                        
        const newtonAlt_5 = new Relation().withUnit("N", Prefix.UNIT, -100).withUnit("g", Prefix.UNIT, 1000000).withUnit("m", Prefix.UNIT).withUnit("N", Prefix.UNIT, 100).withUnit("s", Prefix.UNIT, 2).withUnit("g", Prefix.UNIT, -999999).withUnit("s", Prefix.UNIT, -4);
        expect(conversions.haveSameDimensions(newton.toRelation(), newtonAlt_5.toRelation())).toBe(true);
        expect(conversions.haveSameDimensions(definitions.fromUnitSymbol("N").theoreticalRelation, newtonAlt_5.toRelation())).toBe(true);

    })

})



describe("Can Convert Between Units", ()=>{

    it("Resolves Custom Units To Dimension", ()=>{
        const newton = new Relation().withUnit("g", Prefix.KILO).withUnit("m").withUnit("s", Prefix.UNIT, -2);
        definitions.create("N", "Newton", newton, "Measures Force");


        expect(conversions.fromSrcToDst(new Relation(2).withUnit("N").toRelation(), newton.toRelation())).toBe(2);
        expect(conversions.fromSrcToDst(new Relation(2).withUnit("N").toRelation(), new Relation(2).withUnit("N").toRelation())).toBe(1);
        expect(conversions.fromSrcToDst(new Relation(2).withUnit("N").toRelation(), new Relation(2).withUnit("N").toRelation())).toBe(1);
        expect(conversions.fromSrcToDst(new Relation(2).withUnit("N").toRelation(), new Relation(1).withUnit("N").toRelation())).toBe(2);
        
        expect(conversions.fromSrcToDst(new Relation(20).withUnit("N").toRelation(), new Relation(5).withUnit("g", Prefix.KILO).withUnit("m").withUnit("s", Prefix.UNIT, -2).toRelation())).toBe(4);

    })


    it("Handles incompatibles units", ()=>{
        expect(() => conversions.fromSrcToDst(new Relation(20).withUnit("N").toRelation(), new Relation(5).withUnit("g", Prefix.KILO, 2).withUnit("m").withUnit("s", Prefix.UNIT, -2).toRelation())).toThrow(AssertionError);
    })

    // 6 kg * 20 (mg)^-2 -> 120 (ng)^-1
})


describe("Can Operate on Units", ()=>{

    it("Can multiply units", ()=>{
        const result1 = conversions.multiply(
            new Relation(20).withUnit("N").toRelation(), 
            new Relation(5).withUnit("g", Prefix.KILO, 2).toRelation()
        );
        expect(result1.coefficient).toBe(100);
        expect(result1.units.length).toBe(2);

        // 6 kg * 20 (mg)^-2 -> 120 (ng)^-1
        const result2 = conversions.multiply(
            new Relation(6).withUnit("g", Prefix.KILO).toRelation(), 
            new Relation(20).withUnit("g", Prefix.MILLI, -2).toRelation()
        );
        expect(result2.coefficient).toBe(120);
        expect(result2.units.length).toBe(1);
        expect(result2.units[0].symbol).toBe("g");
        expect(result2.units[0].exponent).toBe(-1);
        expect(result2.units[0].logPrefix).toBe(-9);
        
    })

    
})