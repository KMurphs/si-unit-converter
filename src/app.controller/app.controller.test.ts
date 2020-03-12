import AppController from './app.controller';
import { TUnit, TUnitDefinition, TOpUnit, TSIValue } from './app.types';
import { SISuffix } from './app.native.data';



describe("AppController", ()=>{



  test("Contains Native Definitions", ()=>{
    const mc = new AppController()
    let unitDef: TUnitDefinition|null
    
    unitDef = mc.hasDefinitionFor('m');
    expect(unitDef === null).toBe(false);
    unitDef && expect(unitDef).toHaveProperty('symbol', 'm');
    unitDef && expect(unitDef).toHaveProperty('name', 'meter');
  })



  test("Can Add and Persist Definitions", ()=>{
    let mc = new AppController()
    let unitDef: TUnitDefinition|null

    unitDef = mc.hasDefinitionFor('N');
    expect(unitDef === null).toBe(true);


    mc.addDefinition({
      name: "Newton",
      symbol: 'N',
      description: "",
      measurement: "Force",
      isBasicDimension: {
        value: true,
        symbol: 'L'
      },
      components: {
        factor: 1,
        units: [
          { suffix: SISuffix.KILO, symbol: 'g', exponent: 1 },
          { suffix: SISuffix.UNITY, symbol: 'm', exponent: 1 },
          { suffix: SISuffix.UNITY, symbol: 's', exponent: -2 }
        ]
      }
    })




    mc = new AppController()
    unitDef = mc.hasDefinitionFor('N');
    expect(unitDef === null).toBe(false);
    unitDef && expect(unitDef).toHaveProperty('symbol', 'N');
    unitDef && expect(unitDef).toHaveProperty('name', 'newton');
    unitDef && expect(unitDef.isBasicDimension).toHaveProperty('value', false);
    unitDef && expect(unitDef.isBasicDimension).toHaveProperty('symbol', '');


  })



  test("Can Build Operational Unit", ()=>{
    const mc = new AppController()
    let opUnit: TOpUnit

    opUnit = mc.buildOpUnit([{suffix: SISuffix.UNITY, symbol: 'm', exponent: 1}])
    expect(opUnit.units.length).toBe(1);
    expect(opUnit.units[0]).toHaveProperty('symbol', 'm');
    expect(opUnit.units[0]).toHaveProperty('exponent', 1);
    expect(opUnit.units[0]).toHaveProperty('suffix', 0);
    expect(opUnit.dimension.length).toBe(1);
    expect(opUnit.dimension[0]).toHaveProperty('symbol', 'L');
    expect(opUnit.dimension[0]).toHaveProperty('exponent', 1);
    expect(opUnit.baseFactor).toBe(1);

    
    opUnit = mc.buildOpUnit([{suffix: SISuffix.KILO, symbol: 'g', exponent: -2.5}])
    expect(opUnit.units.length).toBe(1);
    expect(opUnit.units[0]).toHaveProperty('symbol', 'g');
    expect(opUnit.units[0]).toHaveProperty('exponent', -2.5);
    expect(opUnit.units[0]).toHaveProperty('suffix', -7.5);
    expect(opUnit.dimension.length).toBe(1);
    expect(opUnit.dimension[0]).toHaveProperty('symbol', 'M');
    expect(opUnit.dimension[0]).toHaveProperty('exponent', -2.5);
    expect(opUnit.baseFactor).toBe(Math.pow(10, -7.5));


    opUnit = mc.buildOpUnit([{suffix: SISuffix.KILO, symbol: 's', exponent: -2.5},{suffix: SISuffix.DECA, symbol: 's', exponent: 1.5}])
    expect(opUnit.units.length).toBe(1);
    expect(opUnit.units[0]).toHaveProperty('symbol', 's');
    expect(opUnit.units[0]).toHaveProperty('exponent', -1);
    expect(opUnit.units[0]).toHaveProperty('suffix', -6);
    expect(opUnit.dimension.length).toBe(1);
    expect(opUnit.dimension[0]).toHaveProperty('symbol', 'T');
    expect(opUnit.dimension[0]).toHaveProperty('exponent', -1);
    expect(opUnit.baseFactor).toBe(Math.pow(10, -6));


    opUnit = mc.buildOpUnit([{suffix: SISuffix.MILLI, symbol: 's', exponent: -2.5},{suffix: SISuffix.NANO, symbol: 'm', exponent: 1.5},{suffix: SISuffix.CENTI, symbol: 's', exponent: 1.5}])
    expect(opUnit.units.length).toBe(2);
    expect(opUnit.units[0]).toHaveProperty('symbol', 'm');
    expect(opUnit.units[0]).toHaveProperty('exponent', 1.5);
    expect(opUnit.units[0]).toHaveProperty('suffix', -13.5);
    expect(opUnit.units[1]).toHaveProperty('symbol', 's');
    expect(opUnit.units[1]).toHaveProperty('exponent', -1);
    expect(opUnit.units[1]).toHaveProperty('suffix', 4.5);
    expect(opUnit.dimension.length).toBe(2);
    expect(opUnit.dimension[0]).toHaveProperty('symbol', 'L');
    expect(opUnit.dimension[0]).toHaveProperty('exponent', 1.5); 
    expect(opUnit.dimension[1]).toHaveProperty('symbol', 'T');
    expect(opUnit.dimension[1]).toHaveProperty('exponent', -1);
    expect(opUnit.baseFactor).toBe(Math.pow(10, -13.5) * Math.pow(10, 4.5));  



    const defineNewton = true
    const error = new Error("Definition with this symbol already exists");
    defineNewton && expect(()=>mc.addDefinition({
      name: "Newton",
      symbol: 'N',
      description: "",
      measurement: "Force",
      isBasicDimension: {
        value: true,
        symbol: 'L'
      },
      components: {
        factor: 1,
        units: [
          { suffix: SISuffix.KILO, symbol: 'g', exponent: 1 },
          { suffix: SISuffix.UNITY, symbol: 'm', exponent: 1 },
          { suffix: SISuffix.UNITY, symbol: 's', exponent: -2 }
        ]
      }
    })).toThrow(error);


    
    opUnit = mc.buildOpUnit([{suffix: SISuffix.MILLI, symbol: 's', exponent: -2.5},{suffix: SISuffix.NANO, symbol: 'N', exponent: 1.5},{suffix: SISuffix.CENTI, symbol: 's', exponent: 1.5}])
    console.log(opUnit)
    expect(opUnit.units.length).toBe(2);
    expect(opUnit.units[0]).toHaveProperty('symbol', 'N');
    expect(opUnit.units[0]).toHaveProperty('exponent', 1.5);
    expect(opUnit.units[0]).toHaveProperty('suffix', -13.5);
    expect(opUnit.units[1]).toHaveProperty('symbol', 's');
    expect(opUnit.units[1]).toHaveProperty('exponent', -1);
    expect(opUnit.units[1]).toHaveProperty('suffix', 4.5);
    expect(opUnit.dimension.length).toBe(3);
    expect(opUnit.dimension[0]).toHaveProperty('symbol', 'L');
    expect(opUnit.dimension[0]).toHaveProperty('exponent', 1.5); 
    expect(opUnit.dimension[1]).toHaveProperty('symbol', 'M');
    expect(opUnit.dimension[1]).toHaveProperty('exponent', 1.5);
    expect(opUnit.dimension[2]).toHaveProperty('symbol', 'T');
    expect(opUnit.dimension[2]).toHaveProperty('exponent', -4);  
    expect(opUnit.baseFactor).toBe(Math.pow(10, -4.5));  




    opUnit = mc.buildOpUnit([{suffix: 0, symbol: 'N', exponent: 1},{suffix: -1, symbol: 's', exponent: 2}])
    console.log(opUnit)
    expect(opUnit.units.length).toBe(2);
    expect(opUnit.units[0]).toHaveProperty('symbol', 'N');
    expect(opUnit.units[0]).toHaveProperty('exponent', 1);
    expect(opUnit.units[0]).toHaveProperty('suffix', 0);
    expect(opUnit.units[1]).toHaveProperty('symbol', 's');
    expect(opUnit.units[1]).toHaveProperty('exponent', 2);
    expect(opUnit.units[1]).toHaveProperty('suffix', -2);
    expect(opUnit.dimension.length).toBe(2);
    expect(opUnit.dimension[0]).toHaveProperty('symbol', 'L');
    expect(opUnit.dimension[0]).toHaveProperty('exponent', 1); 
    expect(opUnit.dimension[1]).toHaveProperty('symbol', 'M');
    expect(opUnit.dimension[1]).toHaveProperty('exponent', 1); 
    // expect(opUnit.baseFactor).toBe(Math.pow(10, -4.5));  
  })


  test("Can Perform Conversion", async ()=>{
    const mc = new AppController()

    let val: TSIValue

    val = await mc.convert(
      { mantisse: 1, exponent: 1 },
      mc.buildOpUnit([{suffix: SISuffix.KILO, symbol: 'g', exponent: 1}]),
      mc.buildOpUnit([{suffix: SISuffix.UNITY, symbol: 'g', exponent: 1}])
    )
    expect(val).toHaveProperty("mantisse", 1)
    expect(val).toHaveProperty("exponent", 4)
    

    val = await mc.convert(
      { mantisse: 1, exponent: 1 },
      mc.buildOpUnit([{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
      mc.buildOpUnit([{suffix: SISuffix.MEGA, symbol: 's', exponent: 2}])
    )
    expect(val).toHaveProperty("mantisse", 1)
    expect(val).toHaveProperty("exponent", -13)

  })

})
