import React, { Fragment, useState } from 'react';

import "./SIDefinitionEditor.css"
import { TUnitDefinition, TUnit, TSuffixUtils, TUnitDefinitionUtils } from '../../app.controller/app.types';
import { CustomInputText, CustomInputNumberUndefined } from '../CustomInput/CustomInput';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';
import SIUnitEditor from '../SIUnitEditor/SIUnitEditor';
import { updateUnitCollection } from '../../App';
import AddSIUnitButton from '../SIUnitEditor/AddSIUnitButton';
import { UpDownInputContainer } from '../UpDownInput/UpDownInput';


type TProps = {
  definition: TUnitDefinition|undefined,
  onChange: (newVal: TUnitDefinition)=>void,
  onSave: (newVal: TUnitDefinition, isNew: boolean)=>void,
  suffixUtils: TSuffixUtils,
  mustShowParenthesis: boolean,
  unitDefUtils: TUnitDefinitionUtils,
  extraClasses?: string,
}
const SIDefinitionEditor: React.FC<TProps> = ({definition, onChange, extraClasses,  suffixUtils, mustShowParenthesis, unitDefUtils, onSave}) => {

  
  const handleChange = (currDefinition: TUnitDefinition, fieldKey: string, fieldValue: any, useLocalDefinition: boolean)=>{

    let tmp = {...currDefinition}
    switch(fieldKey){
      case 'name': tmp.name = fieldValue as string; break;
      case 'symbol': tmp.symbol = fieldValue as string; break;
      case 'measurement': tmp.measurement = fieldValue as string; break;
      case 'description': tmp.description = fieldValue as string; break;
      case 'isBasicDimension.value': tmp.isBasicDimension.value = fieldValue as boolean; break;
      case 'isBasicDimension.symbol': tmp.isBasicDimension.symbol = fieldValue as string; break;
      case 'components.factor': tmp.components.factor = fieldValue as number; break;
      case 'components.units': tmp.components.units = fieldValue as TUnit[]; break;
      default: break;
    }
    if(!useLocalDefinition){
      onChange(tmp)
    }
    setLocalDefinition({...tmp})
  }

  const emptyUnitDefinition: TUnitDefinition = {
    symbol: '',
    name: '',
    description: '',
    measurement: '',
    components: {
      factor: 1,
      units: []
    },
    isBasicDimension: {
      value: false,
      symbol: ''
    }
  }
  
  const useLocalDefinition = definition === undefined
  const [localDefinition, setLocalDefinition] = useState<TUnitDefinition>(emptyUnitDefinition)
  const currDefinition = definition ? definition : localDefinition
  definition && JSON.stringify(definition) !== JSON.stringify(localDefinition) && setLocalDefinition({...definition})

  const [siunitToAdd, setSiunitToAdd] = useState<string>("")
  console.log("[SIDefinitionEditor]: ", definition, useLocalDefinition, localDefinition)

  return (
    <div className={`definition-page ${extraClasses}`}>



      <h1>{useLocalDefinition ? 'Creating' : 'Viewing'} Unit Definition</h1>



      <div className="definition-id">
        <div className="definition-page-group">
          <span>Unit Name</span>
          <CustomInputText value={currDefinition.name} disabled={!useLocalDefinition} handleChange={(val)=>handleChange(currDefinition, "name", val, useLocalDefinition)}/>
        </div>
        <div className="definition-page-group">
          <span>Symbol</span>
          <CustomInputText value={currDefinition.symbol} disabled={!useLocalDefinition} handleChange={(val)=>handleChange(currDefinition, "symbol", val, useLocalDefinition)}/>
        </div>
      </div>



      <div className="definition-docs">
        <div className="definition-page-group">
          <span>What does the unit measures </span>
          <CustomInputText value={currDefinition.measurement} disabled={!useLocalDefinition} handleChange={(val)=>handleChange(currDefinition, "measurement", val, useLocalDefinition)}/>
        </div>
        <div className="definition-page-group">
          <span>Description for this unit</span>
          <textarea value={currDefinition.description} disabled={!useLocalDefinition} onChange={(evt)=>handleChange(currDefinition, "description", evt.target.value, useLocalDefinition)}/>
        </div>
      </div>



      <div className="definition-composition">
        <div className="definition-page-group">
          <span>isBasicDimension</span>
          <CustomCheckbox extraClasses={"text-black"} disabled={!useLocalDefinition} checked={currDefinition.isBasicDimension.value} handleChange={(val)=>handleChange(currDefinition, "isBasicDimension.value", val, useLocalDefinition)} tokens={['', 'Unit is a Basic Dimension', 'Unit is Composed']}/>
        </div>


        {
          currDefinition.isBasicDimension.value && (
            <Fragment>
              <div className="definition-page-group">
                <span>Dimension Symbol</span>
                <CustomInputText value={currDefinition.isBasicDimension.symbol} disabled={!useLocalDefinition} handleChange={(val)=>handleChange(currDefinition, "isBasicDimension.symbol", val, useLocalDefinition)}/>
              </div>
            </Fragment>
          )
        }



        {
          !currDefinition.isBasicDimension.value && (
            <Fragment>
              <div className="definition-page-group">
                <span>Conversion Factor</span>
                <CustomInputNumberUndefined value={currDefinition.components.factor} disabled={!useLocalDefinition} handleChange={(val)=>handleChange(currDefinition, "components.factor", val, useLocalDefinition)}/>
              </div>
              <div className="definition-page-group">
                <span>Unit Composition</span>
                {
                  currDefinition.components.units.map((un, index) => { 
                    return (
                      <SIUnitEditor siunit={un} 
                                    key={index}
                                    suffixUtils={suffixUtils}
                                    unitDefUtils={unitDefUtils}
                                    onOpenSuffixPane={()=>{}}
                                    onOpenUnitPane={()=>{}}
                                    mustShowParenthesis={mustShowParenthesis}
                                    onChange={newVal=> handleChange(currDefinition, "components.units", updateUnitCollection(currDefinition.components.units, newVal, index), useLocalDefinition)}
                      />
                    )
                  })
                }

                
                <AddSIUnitButton onAdd={()=>handleChange(currDefinition, "components.units", updateUnitCollection([...currDefinition.components.units, {suffix: 0, symbol: siunitToAdd, exponent: 1}], {suffix: 0, symbol: siunitToAdd, exponent: 1}, -1), useLocalDefinition)}>
                    <UpDownInputContainer onNext={()=>setSiunitToAdd(unitDefUtils.getNext(siunitToAdd).symbol)}
                                          onPrevious={()=>setSiunitToAdd(unitDefUtils.getPrevious(siunitToAdd).symbol)}
                    >
                        {siunitToAdd + " "}
                    </UpDownInputContainer>
                </AddSIUnitButton>

              </div>
            </Fragment>
          )
        }
        
      </div>    


      <div className="definition-page-group">
        <button className="definition-save" onClick={evt=>onSave(currDefinition, useLocalDefinition)}>
          {useLocalDefinition ? 'Save' : 'Close'}
        </button>
      </div>       

    </div>

  )

}


SIDefinitionEditor.defaultProps = {
  extraClasses: ""
}
export default SIDefinitionEditor


// {
//   name: "Newton",
//   symbol: 'N',
//   description: "",
//   measurement: "Force",
//   isBasicDimension: {
//     value: true,
//     symbol: 'L'
//   },
//   components: {
//     factor: 1,
//     units: [
//       { suffix: SISuffix.KILO, symbol: 'g', exponent: 1 },
//       { suffix: SISuffix.UNITY, symbol: 'm', exponent: 1 },
//       { suffix: SISuffix.UNITY, symbol: 's', exponent: -2 }
//     ]
//   }