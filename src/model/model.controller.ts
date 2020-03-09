import { TUnitDefinition, TUnit, TSuffix, TRecord, TOpUnit, TDimension, TSIValue } from "./types"
import { nativeUnitDefinitions, nativeSuffixes, SISuffix } from "./native";

export default class ModelController {

  private unitsDefinitions: TUnitDefinition[]
  private suffixes: TSuffix[]
  private history: TRecord[]


  constructor(){
     
    let defDict: {[key: string]: TUnitDefinition} = {};
    [...nativeUnitDefinitions, ...this.storage.getDefinitions()].forEach(def => defDict[def.symbol] = {...def})
    this.unitsDefinitions = Object.keys(defDict).map(key => defDict[key])

    this.suffixes = nativeSuffixes
    this.history = []
  }


  private storage = {

    definitionKey: 'customdefinitions',
    getDefinitions: (): TUnitDefinition[] => {
      const units = localStorage.getItem(this.storage.definitionKey)
      return units ? JSON.parse(units) as TUnitDefinition[] : []
    },
    saveDefinitions: () => {
      this.storage.deleteDefinitions()
      localStorage.setItem(this.storage.definitionKey, JSON.stringify(this.unitsDefinitions))
    },
    deleteDefinitions: () => {
      localStorage.removeItem(this.storage.definitionKey)
    },



    historyKey: 'history',
    getHistory: (): TRecord[] => {
      const units = localStorage.getItem(this.storage.historyKey)
      return units ? JSON.parse(units) as TRecord[] : []
    },
    saveHistory: () => {
      this.storage.deleteHistory()
      localStorage.setItem(this.storage.historyKey, JSON.stringify(this.history))
    },
    deleteHistory: () => {
      localStorage.removeItem(this.storage.historyKey)
    }


  }






  buildOpUnit(units: TUnit[]): TOpUnit{

    // Check that all unit symbols have associated definitions
    let unitsWithKnownDefinition: {[key: string]: TUnit} = {}
    let unitsToBeProcessed: any = {} // Create a tracker for the units that haven't been processed yet
    units.forEach(un => unitsToBeProcessed[un.symbol] = 1)

    this.unitsDefinitions.forEach(currDef => {
      units.forEach(unit => {
        if(unit.symbol === currDef.symbol){
          // Mark the current unit as processed (i.e remove it from tracker)
          unitsToBeProcessed[unit.symbol] && (delete unitsToBeProcessed[unit.symbol]);
          // If the unit has already been met, collapse all its instances into one with updated suffix and exponent
          if(unitsWithKnownDefinition[unit.symbol]){
            unitsWithKnownDefinition[unit.symbol].exponent += unit.exponent
            unitsWithKnownDefinition[unit.symbol].suffix += unit.suffix * unit.exponent
          }else{
            unitsWithKnownDefinition[unit.symbol] = {...unit}
            unitsWithKnownDefinition[unit.symbol].suffix = unit.suffix * unit.exponent
          }
        }
      })
    })



    if(Object.keys(unitsToBeProcessed).length !== 0){
      throw new Error(`Unknown Units Found: ${JSON.stringify(unitsToBeProcessed)}`);
    }
    
    

    //Collect Dimensions
    let collectDimensions = (rawUnit: TUnit[], dict: {[key: string]: number}): {[key: string]: number} => {

      // Ensure that the key factor is always present
      !dict["factor"] && (dict["factor"] = 1)
      

      if(rawUnit.length !== 0){
        let [currUnit, ..._rawUnit] = [...rawUnit];
        let currDef = this.unitsDefinitions.filter(def => def.symbol === currUnit.symbol)[0];

        // If we found a basic dimension, collect it along with its exponent
        currDef && currDef.isBasicDimension.value === true && dict[currDef.isBasicDimension.symbol] && (dict[currDef.isBasicDimension.symbol] = dict[currDef.isBasicDimension.symbol] + currUnit.exponent);
        currDef && currDef.isBasicDimension.value === true && !dict[currDef.isBasicDimension.symbol] && (dict[currDef.isBasicDimension.symbol] = currUnit.exponent);
        currDef && currDef.isBasicDimension.value === true && (dict["factor"] *= Math.pow(10, currUnit.suffix)); //Suffix already has accumulated the exponent from above


        // If we found a composite unit, extract component into raw dimensions to be processed in later recursion cycles
        currDef && currDef.isBasicDimension.value !== true && (_rawUnit = [
          ..._rawUnit, 
          ...currDef.components.units.map(un => {
            un.exponent *= currUnit.exponent
            un.suffix *= currUnit.exponent
            return un
          })
        ])
        currDef && currDef.isBasicDimension.value !== true && (dict["factor"] *= currDef.components.factor * Math.pow(10, currUnit.suffix))

        
        return collectDimensions(_rawUnit, dict)
      }else{
        return dict
      }

    }



    let validUnits = Object.keys(unitsWithKnownDefinition).sort().map(key => unitsWithKnownDefinition[key])
    let dimensionsDict: {[key: string]: number} = collectDimensions(validUnits,  {})
    let factor = dimensionsDict["factor"]
    delete dimensionsDict["factor"]
    let dimensions = Object.keys(dimensionsDict).sort().map(key => { return { symbol: key, exponent: dimensionsDict[key] }})



    // Build Object
    const unit: TOpUnit = {
      units: validUnits,
      dimension: dimensions,
      baseFactor: factor
    }


    return unit;
  }






  hasDefinitionFor(unitSymbol: string): TUnitDefinition|null{
    const def = this.unitsDefinitions.filter(def => def.symbol === unitSymbol)[0]
    return def ? def : null
  }

  addDefinition(newDef: TUnitDefinition, isBasicDimension?: boolean): Promise<TUnitDefinition>{
    // Check whether we already have a definition with this symbol
    let existingDef = this.unitsDefinitions.filter(def => def.symbol === newDef.symbol)[0]
    if(existingDef){
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
      throw new Error("Definition with this symbol already exists");
    }else if(newDef.symbol === '' || newDef.measurement === '' || newDef.name === ''){
      throw new Error("Definition is not complete");
    }

    // const def = JSON.parse(newDef) as TRecord[]
    const def = {...newDef}
    def.name = def.name.toLowerCase()
    if(!isBasicDimension){
      def.isBasicDimension.value = false
      def.isBasicDimension.symbol = ''
    }else{
      let exisitingDefWithSameDimension = this.unitsDefinitions.filter(def => def.isBasicDimension.value === true && def.isBasicDimension.symbol === newDef.isBasicDimension.symbol)[0]
      if(exisitingDefWithSameDimension){
        throw new Error("Definition with this dimension already exists");
      }
    }


    // add definition to internal variable
    this.unitsDefinitions = [...this.unitsDefinitions, def]

    // save definition to storage
    return new Promise((resolve, reject) => {
      this.storage.saveDefinitions()
      resolve(this.unitsDefinitions.filter(def => def.symbol === newDef.symbol)[0])
    })

  }








  convert(val: TSIValue, initialUnits: TOpUnit, targetUnits: TOpUnit, author: string = ""): Promise<TSIValue>{
    
    return new Promise((resolve, reject) => {
      let res: TSIValue = {
        mantisse: 1,
        exponent: 1
      }

      if(JSON.stringify(initialUnits.dimension) !== JSON.stringify(targetUnits.dimension)){
        reject("Dimension Do Not Match!")
      }



      this.history = [...this.history, {
        meta: {author: author, timestamp: new Date().getTime()},
        initialValue: val,
        targetValue: res,
        initiatUnits: initialUnits,
        targetUnits: targetUnits,
      }]
      this.storage.saveHistory()


      resolve(res)
    })
  }






}



