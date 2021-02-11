import { resolveToDimension } from ".";
import { addDefinition, Relation, getDefinitionBySymbol } from "./definitions.db";


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
        });
    })

})