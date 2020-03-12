import React, { Fragment } from 'react';

import "./SIDefinitionEditor.css"
import { TUnitDefinition, TUnit, TSuffixUtils, TUnitDefinitionUtils } from '../../app.controller/app.types';
import { CustomInputText, CustomInputNumberUndefined } from '../CustomInput/CustomInput';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';
import SIUnitEditor from '../SIUnitEditor/SIUnitEditor';
import { updateUnitCollection } from '../../App';


type TProps = {
  definition: TUnitDefinition,
  onChange: (newVal: TUnitDefinition)=>void,
  onSave: (newVal: TUnitDefinition)=>void,
  suffixUtils: TSuffixUtils,
  mustShowParenthesis: boolean,
  unitDefUtils: TUnitDefinitionUtils,
  extraClasses?: string,
}
const SIDefinitionEditor: React.FC<TProps> = ({definition, onChange, extraClasses,  suffixUtils, mustShowParenthesis, unitDefUtils}) => {

  const handleChange = (currDefinition: TUnitDefinition, fieldKey: string, fieldValue: any)=>{
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
    onChange(tmp)
  }
  
  return (
    <div className={`definition-page ${extraClasses}`}>



      <h1>Updating Unit Definition</h1>



      <div className="definition-id">
        <div className="definition-page-group">
          <span>Unit Name</span>
          <CustomInputText value={definition.name} handleChange={(val)=>handleChange(definition, "name", val)}/>
        </div>
        <div className="definition-page-group">
          <span>Symbol</span>
          <CustomInputText value={definition.symbol} handleChange={(val)=>handleChange(definition, "symbol", val)}/>
        </div>
      </div>



      <div className="definition-docs">
        <div className="definition-page-group">
          <span>What does the unit measures </span>
          <CustomInputText value={definition.measurement} handleChange={(val)=>handleChange(definition, "measurement", val)}/>
        </div>
        <div className="definition-page-group">
          <span>Description for this unit</span>
          <textarea value={definition.description} onChange={(evt)=>handleChange(definition, "description", evt.target.value)}/>
        </div>
      </div>



      <div className="definition-composition">
        <div className="definition-page-group">
          <span>isBasicDimension</span>
          <CustomCheckbox extraClasses={"text-black"} checked={definition.isBasicDimension.value} handleChange={(val)=>handleChange(definition, "isBasicDimension.value", val)} tokens={['', 'Unit is a Basic Dimension', 'Unit is Composed']}/>
        </div>


        {
          definition.isBasicDimension.value && (
            <Fragment>
              <div className="definition-page-group">
                <span>Dimension Symbol</span>
                <CustomInputText value={definition.isBasicDimension.symbol} handleChange={(val)=>handleChange(definition, "isBasicDimension.symbol", val)}/>
              </div>
            </Fragment>
          )
        }



        {
          !definition.isBasicDimension.value && (
            <Fragment>
              <div className="definition-page-group">
                <span>Conversion Factor</span>
                <CustomInputNumberUndefined value={definition.components.factor} handleChange={(val)=>handleChange(definition, "components.factor", val)}/>
              </div>
              <div className="definition-page-group">
                <span>Unit Composition</span>
                {
                  definition.components.units.map((un, index) => { 
                    return (
                      <SIUnitEditor siunit={un} 
                                    key={index}
                                    suffixUtils={suffixUtils}
                                    unitDefUtils={unitDefUtils}
                                    onOpenSuffixPane={()=>{}}
                                    onOpenUnitPane={()=>{}}
                                    mustShowParenthesis={mustShowParenthesis}
                                    onChange={newVal=> handleChange(definition, "components.units", updateUnitCollection(definition.components.units, newVal, index))}
                      />
                    )
                  })
                }
              </div>
            </Fragment>
          )
        }
        
      </div>    


      <div className="definition-page-group">
        <button className="definition-save">
          Save
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