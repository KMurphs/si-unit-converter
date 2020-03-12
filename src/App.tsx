import React, { useRef, useState } from 'react';

import './App.css';
import './utils.css';
import AppController from './app.controller/app.controller';
import { TSIValue, TOpUnit, TUnit, TUnitDefinition, TSuffix } from './app.controller/app.types';
import { SISuffix } from './app.controller/app.native.data';
import SIValueEditor from './components/SIValueEditor/SIValueEditor';
import SIUnitEditor from './components/SIUnitEditor/SIUnitEditor';
import Conversion from './components/Conversion/Conversion';
import { toCapital } from './components/mathjax.utils';
import SlideUpPane, { UpDownInputContainer } from './components/SlideUpPane/SlideUpPane';
import Modal from './components/Modal/Modal';
import SIDefinitionEditor from './components/SIDefinitionEditor/SIDefinitionEditor';
import AddSIUnitButton from './components/SIUnitEditor/AddSIUnitButton';

declare global {
  interface Window { MathJax: any; }
}
type TUiItem = {
  initialValue: TSIValue,
  initialUnits: TOpUnit,
  targetUnits: TOpUnit,
  targetValue: TSIValue,
  author: string
}
type TControls = {
  initialvalue: boolean,
  initialunits: boolean,
  targetunits: boolean,
  viewsuffixes: boolean,
  viewunits: boolean,
  showparenthesis: boolean,
}
function App() {

  window.MathJax && console.log(window.MathJax)

  let ac = useRef<AppController|null>(null);
  (ac.current === null) && (ac.current = new AppController());
  const {unitsDefinitionsUtils, suffixUtils} = ac.current
  console.log('[App]: Conversion Manager Version: ', ac.current.getVersion())

  const controlsDefault = {
    initialvalue: false,
    initialunits: false,
    targetunits: false,
    viewsuffixes: false,
    viewunits: false,
    showparenthesis: false,
  }
  const [controls, setControls] = useState<TControls>(controlsDefault)
  const {showparenthesis} = controls
  // const {showparenthesis, ..._showSideBarData} = controls
  // const showSideBarData = Object.values(_showSideBarData).reduce((acc: boolean, val: boolean)=>acc||val, false)




  const [uiConversion, _setUiConversion] = useState<TUiItem>({
    initialValue: { mantisse: 1, exponent: 1 },
    initialUnits: ac.current.buildOpUnit([{suffix: SISuffix.CENTI, symbol: 'm', exponent: 2},{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
    targetUnits: ac.current.buildOpUnit([{suffix: SISuffix.CENTI, symbol: 'm', exponent: 2},{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
    targetValue: { mantisse: 1, exponent: 1 },
    author: ""
  })
  const setUiConversion = async (ac: AppController, currUiConversion: TUiItem, key: string, val: any)=>{
    let curr = {...currUiConversion}

    key.toLowerCase() === "initialValue".toLowerCase() && val && (curr.initialValue = {...val as TSIValue})
    key.toLowerCase() === "initialUnits".toLowerCase() && val && (curr.initialUnits = ac.buildOpUnit(val as TUnit[]))
    key.toLowerCase() === "targetUnits".toLowerCase() && val && (curr.targetUnits = ac.buildOpUnit(val as TUnit[]))
    key.toLowerCase() === "author".toLowerCase() && val && (curr.author = val as string)
    if(key.toLowerCase() !== "author".toLowerCase()){
      const tmp = await ac.convert(curr.initialValue, curr.initialUnits, curr.targetUnits)
                          .catch(err => console.log(err));
      tmp && (curr.targetValue = {...tmp})
    }
    
    console.log(key, val, curr.initialUnits)

    _setUiConversion({...curr})
  }
  console.log(uiConversion.initialUnits.units, uiConversion.initialUnits.dimension)




  // const [unitPane, usingPaneForControl] = useState<boolean>(false)
  const [siunitToAdd, setSiunitToAdd] = useState<TUnitDefinition>(unitsDefinitionsUtils.getBySymbol("m"))
  const [siunitOnDisplay, setSiunitOnDisplay] = useState<TUnit>({suffix: SISuffix.UNITY, symbol: 'm', exponent: 0})
  const onResetApp = ()=>{
    // setAlsoShowUnitsPane(false)
    setControls({...controlsDefault})
    setSiunitToAdd(unitsDefinitionsUtils.getBySymbol("m"))
    ac.current && _setUiConversion({
      initialValue: { mantisse: 1, exponent: 1 },
      initialUnits: ac.current.buildOpUnit([{suffix: SISuffix.CENTI, symbol: 'm', exponent: 2},{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
      targetUnits: ac.current.buildOpUnit([{suffix: SISuffix.CENTI, symbol: 'm', exponent: 2},{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
      targetValue: { mantisse: 1, exponent: 1 },
      author: ""
    })
  }
  
  
  
  
  

  const updateControlObj = (controlsDefault: TControls, controlsCurrent: TControls, updateKeys: string[], updateVals: boolean[])=>{
    let state = {...controlsDefault}; 

    for(let idx in updateKeys){
      switch(updateKeys[idx]){
        case 'initialunits': state.initialunits = updateVals[idx]; break;
        case 'initialvalue': state.initialvalue = updateVals[idx]; break;
        case 'targetunits': state.targetunits = updateVals[idx]; break;
        case 'viewsuffixes': state.viewsuffixes = updateVals[idx]; break;
        case 'viewunits': state.viewunits = updateVals[idx]; break;
        default: break;
      }
    }

    state.showparenthesis = controlsCurrent.showparenthesis; 
    return state
  }
  let onPaneItemClick = useRef<Function|null>(null)
  
  

  
  const [definitionToEdit, setDefinitionToEdit] = useState<TUnitDefinition|null|undefined>(null)














  
  
  
  return (
    <div className="App d-flex-row bg-white">

        <div className="app-container bg-red-100">


          <h1>Current Conversion</h1>
          
          
          <div className="current-conversion">
            <Conversion initialValue={uiConversion.initialValue}
                        targetValue={uiConversion.targetValue}
                        initialUnits={uiConversion.initialUnits}
                        targetUnits={uiConversion.targetUnits}
                        getSuffix={suffixUtils.getByValue}
                        mustShowParenthesis={showparenthesis}
            />
          </div>






          <SlideUpPane state={controls.initialvalue} onClose={()=>{let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.initialvalue = false; setControls(state)}}>
            <SIValueEditor sivalue={{...uiConversion.initialValue}} 
                         onChange={newVal=>ac.current && setUiConversion(ac.current, uiConversion, "initialValue", newVal)}
            />
          </SlideUpPane>


















          <SlideUpPane state={controls.initialunits} onClose={()=>{let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.initialunits = false; setControls(state)}}>
            {
              uiConversion.initialUnits.units.map((un, index) => { 
                return (
                  <SIUnitEditor siunit={un} 
                                key={index}
                                suffixUtils={suffixUtils}
                                unitDefUtils={unitsDefinitionsUtils}
                                mustShowParenthesis={showparenthesis}
                                onOpenSuffixPane={()=>{
                                  onPaneItemClick.current = (suff: TSuffix)=>{
                                    setControls(updateControlObj(controlsDefault, controls, ["viewsuffixes", "initialunits"], [false, true]))
                                    let _un = {...un}
                                    _un.suffix = suff.exponentOf10 
                                    ac.current && setUiConversion(ac.current, uiConversion, "initialUnits", updateUnitCollection(uiConversion.initialUnits.units, _un, index))
                                    onPaneItemClick.current = null;
                                  }
                                  setSiunitOnDisplay(tmp => {tmp.suffix = un.suffix/un.exponent; tmp.symbol = un.symbol ; return {...tmp}})
                                  setControls(updateControlObj(controlsDefault, controls, ["viewsuffixes"], [true]))
                                }}
                                onOpenUnitPane={()=>{
                                  onPaneItemClick.current = (def: TUnitDefinition)=>{
                                    setControls(updateControlObj(controlsDefault, controls, ["viewsuffixes", "initialunits"], [false, true]))
                                    let _un = {...un}
                                    _un.symbol = def.symbol
                                    _un.suffix = _un.suffix/_un.exponent  
                                    ac.current && setUiConversion(ac.current, uiConversion, "initialUnits", updateUnitCollection(uiConversion.initialUnits.units, _un, index))
                                    onPaneItemClick.current = null;
                                  }
                                  setSiunitOnDisplay(tmp => {tmp.suffix = un.suffix/un.exponent; tmp.symbol = un.symbol ; return {...tmp}})
                                  setControls(updateControlObj(controlsDefault, controls, ["viewunits"], [true]))
                                }}
                                onChange={newVal=>ac.current && setUiConversion(ac.current, uiConversion, "initialUnits", updateUnitCollection(uiConversion.initialUnits.units, newVal, index))}
                  />
                )
              })
            }

            
            <AddSIUnitButton onAdd={()=>ac.current && setUiConversion(ac.current, uiConversion, "initialUnits", [...uiConversion.initialUnits.units.map(un=>{un.suffix = un.suffix/un.exponent; return {...un}}), {suffix: SISuffix.UNITY, symbol: siunitToAdd.symbol, exponent: 1}])}>
                <UpDownInputContainer onNext={()=>setSiunitToAdd({...unitsDefinitionsUtils.getNext(siunitToAdd.symbol)})}
                                      onPrevious={()=>setSiunitToAdd({...unitsDefinitionsUtils.getPrevious(siunitToAdd.symbol)})}
                >
                    {siunitToAdd.symbol + " "}
                </UpDownInputContainer>
            </AddSIUnitButton>
          </SlideUpPane>


          <SlideUpPane state={controls.targetunits} onClose={()=>{let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.targetunits = false; setControls(state)}}>
            {
              uiConversion.targetUnits.units.map((un, index) => { 
                return (
                  <SIUnitEditor siunit={un} 
                                key={index}
                                suffixUtils={suffixUtils}
                                unitDefUtils={unitsDefinitionsUtils}
                                onOpenSuffixPane={()=>{
                                  onPaneItemClick.current = (suff: TSuffix)=>{
                                    setControls(updateControlObj(controlsDefault, controls, ["viewsuffixes", "targetunits"], [false, true]))
                                    let _un = {...un}
                                    _un.suffix = suff.exponentOf10 
                                    ac.current && setUiConversion(ac.current, uiConversion, "targetUnits", updateUnitCollection(uiConversion.targetUnits.units, _un, index))
                                    onPaneItemClick.current = null;
                                  }
                                  setSiunitOnDisplay(tmp => {tmp.suffix = un.suffix/un.exponent; tmp.symbol = un.symbol ; return {...tmp}})
                                  setControls(updateControlObj(controlsDefault, controls, ["viewsuffixes"], [true]))
                                }}
                                onOpenUnitPane={()=>{
                                  onPaneItemClick.current = (def: TUnitDefinition)=>{
                                    setControls(updateControlObj(controlsDefault, controls, ["viewsuffixes", "targetunits"], [false, true]))
                                    let _un = {...un}
                                    _un.symbol = def.symbol
                                    _un.suffix = _un.suffix/_un.exponent  
                                    ac.current && setUiConversion(ac.current, uiConversion, "targetUnits", updateUnitCollection(uiConversion.targetUnits.units, _un, index))
                                    onPaneItemClick.current = null;
                                  }
                                  setSiunitOnDisplay(tmp => {tmp.suffix = un.suffix/un.exponent; tmp.symbol = un.symbol ; return {...tmp}})
                                  setControls(updateControlObj(controlsDefault, controls, ["viewunits"], [true]))
                                }}
                                mustShowParenthesis={showparenthesis}
                                onChange={newVal=>ac.current && setUiConversion(ac.current, uiConversion, "targetUnits", updateUnitCollection(uiConversion.targetUnits.units, newVal, index))}
                  />
                )
              })
            }
            <AddSIUnitButton onAdd={()=>ac.current && setUiConversion(ac.current, uiConversion, "targetUnits", [...uiConversion.targetUnits.units.map(un=>{un.suffix = un.suffix/un.exponent; return {...un}}), {suffix: SISuffix.UNITY, symbol: siunitToAdd.symbol, exponent: 1}])}>
                <UpDownInputContainer onNext={()=>setSiunitToAdd({...unitsDefinitionsUtils.getNext(siunitToAdd.symbol)})}
                                          onPrevious={()=>setSiunitToAdd({...unitsDefinitionsUtils.getPrevious(siunitToAdd.symbol)})}
                >
                    {siunitToAdd.symbol + " "}
                </UpDownInputContainer>
            </AddSIUnitButton>
          </SlideUpPane>
        </div>





















        <div className="app-sidebar bg-gray-800 text-white box-shadow">


          <div className={`app-side-data-container ${controls.viewsuffixes ? 'app-side-data-container--visible' : ''}`}>
            {
              suffixUtils.getAll().map((un, id) => (
                <div key={id} onClick={ evt => { onPaneItemClick && onPaneItemClick.current && onPaneItemClick.current(un); setSiunitOnDisplay(tmp => {tmp.suffix=un.exponentOf10; return {...tmp}}) } } className={`app-side-data-item app-side-data-item-suffix ${un.exponentOf10 === 0?'app-side-data-item-suffix--disabled':''} ${siunitOnDisplay.suffix===un.exponentOf10?'app-side-data-item-suffix--active':''}`}>
                  <p className="suffix-exponent">10 <span>{un.exponentOf10>0?'+':''}{un.exponentOf10}</span></p>
                  <p className="suffix-details">
                    <span className="suffix-name">{un.exponentOf10 > 0 ? toCapital(un.name) : un.name.toLowerCase()}</span>
                    <span className="suffix-symbol">{un.symbol}&nbsp;</span>
                  </p>
                </div>
              ))
            }
          </div>



          <div className={`app-side-data-container ${controls.viewunits ? 'app-side-data-container--visible' : ''}`}>
            {
              unitsDefinitionsUtils.getAll().map((un, id) => (
                <div key={id} onClick={ evt => { onPaneItemClick && onPaneItemClick.current && onPaneItemClick.current(un); setSiunitOnDisplay(tmp => {tmp.symbol=un.symbol; return {...tmp}}) }  }  className={`app-side-data-item app-side-data-item-unit-definition  ${siunitOnDisplay.symbol===un.symbol?'app-side-data-item-unit-definition--active':''}`}>
                  <p className="definition-symbol">{un.symbol}</p>
                  <p className="definition-details">
                    <span className="definition-name">{un.name}</span>
                    <span className="definition-view" onClick={evt=>{evt.stopPropagation();evt.preventDefault();setDefinitionToEdit({...un})}}><i className="fas fa-eye"></i></span>
                    <span className="definition-measures">*{un.measurement}</span>
                  </p>
                </div>
              ))
            }
            <div onClick={evt=>setDefinitionToEdit(undefined)} className="add-definition app-side-data-item app-side-data-item-unit-definition"><div><i className="fas fa-plus"></i></div><p>Add New</p></div>
          </div>
          <Modal isActive={definitionToEdit!==null} onDeactivate={()=>setDefinitionToEdit(null)} extraClasses={"top-z-index"}>
            {
              definitionToEdit!==null && ac.current && (
                <SIDefinitionEditor definition={definitionToEdit} 
                                    onChange={(def)=>setDefinitionToEdit({...def})} 
                                    onSave={(def)=>{ac.current && ac.current.addDefinition({...def}); setDefinitionToEdit(null)}}
                                    suffixUtils={suffixUtils}
                                    unitDefUtils={unitsDefinitionsUtils}
                                    mustShowParenthesis={showparenthesis}
                />
              )
            }
          </Modal>











          <div className="app-side-controls-container bg-gray-800">
            <label htmlFor="control-initialunits" className={`sidebar-control-container ${controls.initialunits?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-initialunits" checked={controls.initialunits} onChange={evt => { let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.initialunits = evt.target.checked; setControls(state)}}/><div className="sidebar-control_details">Initial Units</div><div className="sidebar-control"><i className="fas fa-balance-scale"></i></div></label>
            <label htmlFor="control-initialvalue" className={`sidebar-control-container ${controls.initialvalue?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-initialvalue" checked={controls.initialvalue} onChange={evt => { let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.initialvalue = evt.target.checked; setControls(state)}}/><div className="sidebar-control_details">Value To Convert</div><div className="sidebar-control"><i className="fas fa-sort-numeric-up"></i></div></label>
            <label htmlFor="control-targetunits" className={`sidebar-control-container ${controls.targetunits?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-targetunits" checked={controls.targetunits} onChange={evt => { let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.targetunits = evt.target.checked; setControls(state)}}/><div className="sidebar-control_details">Final Units</div><div className="sidebar-control"><i className="fas fa-balance-scale-right"></i></div></label>
            <label htmlFor="control-viewsuffixes" className={`sidebar-control-container ${controls.viewsuffixes?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-viewsuffixes" checked={controls.viewsuffixes} onChange={evt => { let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.viewsuffixes = evt.target.checked; setControls(state)}}/><div className="sidebar-control_details">View Suffixes</div><div className="sidebar-control"><i className="fas fa-sort-amount-down"></i></div></label>
            <label htmlFor="control-viewunits" className={`sidebar-control-container ${controls.viewunits?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-viewunits" checked={controls.viewunits} onChange={evt => { let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.viewunits = evt.target.checked; setControls(state)}}/><div className="sidebar-control_details">View Units</div><div className="sidebar-control"><i className="fas fa-font"></i></div></label>
            <label htmlFor="control-showparenthesis" className={`sidebar-control-container ${controls.showparenthesis?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-showparenthesis" checked={controls.showparenthesis} onChange={evt => { const state = evt.target.checked; setControls(cnt => {cnt.showparenthesis=state;return {...cnt}})}}/><div className="sidebar-control_details">Show/Hide Parenthesis</div><div className="sidebar-control sidebar-control-parenthesis"><p>()</p></div></label>
            <div className="sidebar-control-container" onClick={evt=>onResetApp()}><div className="sidebar-control_details">Reset App</div><div className="sidebar-control"><i className="fas fa-undo-alt"></i></div></div>
          </div>




        </div>
    </div>
  );
}

export default App;


const updateUnitCollection = (unCollection: TUnit[], unObj: TUnit, unIndex: number): TUnit[]=>{
  const uns = unCollection.map((tmp, idx) => {
    (unIndex === idx) && (tmp = {...unObj});
    (unIndex !== idx) && (tmp.suffix /= tmp.exponent);
    return tmp;
  })
  return uns
}

export {updateUnitCollection}