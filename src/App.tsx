import React, { useRef, useState } from 'react';

import './App.css';
import './utils.css';
import AppController from './app.controller/app.controller';
import { TSIValue, TOpUnit, TUnit } from './app.controller/app.types';
import { SISuffix } from './app.controller/app.native.data';
import SIValueEditor from './components/SIValueEditor/SIValueEditor';
import SIUnitEditor from './components/SIUnitEditor/SIUnitEditor';
import Conversion from './components/Conversion/Conversion';

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
  const {showparenthesis, ..._showSideBarData} = controls
  // const showSideBarData = Object.values(_showSideBarData).reduce((acc: boolean, val: boolean)=>acc||val, false)




  const [uiConversion, _setUiConversion] = useState<TUiItem>({
    initialValue: { mantisse: 1, exponent: 1 },
    initialUnits: ac.current.buildOpUnit([{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
    targetUnits: ac.current.buildOpUnit([{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
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
    
    console.log(key, curr.initialUnits)

    _setUiConversion({...curr})
  }
  console.log(uiConversion.initialUnits)




  return (
    <div className="App d-flex-row">

        <div className="app-container bg-red-100">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas unde tempora adipisci qui, exercitationem fuga vel at recusandae placeat labore dicta odit? Blanditiis aut voluptatem dicta ipsum velit qui iure voluptatibus non, cupiditate nihil consectetur quod reiciendis laudantium, illo at et vitae. Nihil quis rerum tenetur vel possimus voluptate commodi vero eius nemo voluptas quos magni voluptatum eligendi consectetur, enim odit adipisci dicta repellat. Provident quae culpa eaque suscipit deserunt sequi temporibus sed placeat quia et, quam quibusdam esse qui, voluptatem expedita deleniti dicta. Repudiandae aut totam reprehenderit voluptatibus consectetur praesentium animi accusantium natus a! Provident enim vel minima impedit.</p>
          <div className="current-conversion">
            <Conversion initialValue={uiConversion.initialValue}
                        targetValue={uiConversion.targetValue}
                        initialUnits={uiConversion.initialUnits}
                        targetUnits={uiConversion.targetUnits}
                        getSuffix={suffixUtils.getByValue}
            />
          </div>

          <SIValueEditor sivalue={{...uiConversion.initialValue}} 
                         onChange={newVal=>ac.current && setUiConversion(ac.current, uiConversion, "initialValue", newVal)}
          />
        
          {
            uiConversion.initialUnits.units.map((un, index) => { 
              return (
                <SIUnitEditor siunit={un} 
                              key={index}
                              suffixUtils={suffixUtils}
                              unitDefUtils={unitsDefinitionsUtils}
                              onChange={newVal=>{
                                const uns = uiConversion.initialUnits.units.map((tmp, idx) => {
                                  (index === idx) && (tmp = {...newVal});
                                  return tmp;
                                })
                                ac.current && setUiConversion(ac.current, uiConversion, "initialUnits", uns)
                              }}
                />
              )
            })
          }
          
          {
            uiConversion.targetUnits.units.map((un, index) => { 
              return (
                <SIUnitEditor siunit={un} 
                              key={index}
                              suffixUtils={suffixUtils}
                              unitDefUtils={unitsDefinitionsUtils}
                              onChange={newVal=>{
                                const uns = uiConversion.targetUnits.units.map((tmp, idx) => {
                                  (index === idx) && (tmp = {...newVal});
                                  return tmp;
                                })
                                ac.current && setUiConversion(ac.current, uiConversion, "targetUnits", uns)
                              }}
                />
              )
            })
          }


        </div>




        <div className="app-sidebar bg-gray-800 text-white box-shadow">
          <div className={`app-side-data-container ${controls.initialunits ? 'app-side-data-container--visible' : ''}`}>
            {
              Array(100).fill(1).map((it, id) => (<div className="app-side-data-item"><p>{id}</p></div>))
            }
          </div>
          <div className={`app-side-data-container ${controls.initialvalue ? 'app-side-data-container--visible' : ''}`}>
            {
              Array(100).fill(1).map((it, id) => (<div className="app-side-data-item"><p>{id}</p></div>))
            }
          </div>
          <div className={`app-side-data-container ${controls.targetunits ? 'app-side-data-container--visible' : ''}`}>
            {
              Array(100).fill(1).map((it, id) => (<div className="app-side-data-item"><p>{id}</p></div>))
            }
          </div>


          <div className={`app-side-data-container ${controls.viewsuffixes ? 'app-side-data-container--visible' : ''}`}>
            {
              suffixUtils.getAll().map((un, id) => (<div key={id} className="app-side-data-item app-side-data-item-suffix"><p className="suffix-symbol">{un.symbol}&nbsp;</p><p className="suffix-details"><span className="suffix-name">{un.name}</span><span className="suffix-exponent">10 <span>{un.exponentOf10}</span></span></p></div>))
            }
          </div>
          <div className={`app-side-data-container ${controls.viewunits ? 'app-side-data-container--visible' : ''}`}>
            {
              Array(100).fill(1).map((it, id) => (<div className="app-side-data-item"><p>{id}</p></div>))
            }
          </div>
          <div className="app-side-controls-container bg-gray-800">
            <label htmlFor="control-initialunits" className={`sidebar-control-container ${controls.initialunits?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-initialunits" checked={controls.initialunits} onChange={evt => { let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.initialunits = evt.target.checked; setControls(state)}}/><div className="sidebar-control_details">Initial Units</div><div className="sidebar-control"><i className="fas fa-balance-scale"></i></div></label>
            <label htmlFor="control-initialvalue" className={`sidebar-control-container ${controls.initialvalue?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-initialvalue" checked={controls.initialvalue} onChange={evt => { let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.initialvalue = evt.target.checked; setControls(state)}}/><div className="sidebar-control_details">Value To Convert</div><div className="sidebar-control"><i className="fas fa-sort-numeric-up"></i></div></label>
            <label htmlFor="control-targetunits" className={`sidebar-control-container ${controls.targetunits?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-targetunits" checked={controls.targetunits} onChange={evt => { let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.targetunits = evt.target.checked; setControls(state)}}/><div className="sidebar-control_details">Final Units</div><div className="sidebar-control"><i className="fas fa-balance-scale-right"></i></div></label>
            <label htmlFor="control-viewsuffixes" className={`sidebar-control-container ${controls.viewsuffixes?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-viewsuffixes" checked={controls.viewsuffixes} onChange={evt => { let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.viewsuffixes = evt.target.checked; setControls(state)}}/><div className="sidebar-control_details">View Suffixes</div><div className="sidebar-control"><i className="fas fa-sort-amount-down"></i></div></label>
            <label htmlFor="control-viewunits" className={`sidebar-control-container ${controls.viewunits?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-viewunits" checked={controls.viewunits} onChange={evt => { let state = {...controlsDefault}; state.showparenthesis = controls.showparenthesis; state.viewunits = evt.target.checked; setControls(state)}}/><div className="sidebar-control_details">View Units</div><div className="sidebar-control"><i className="fas fa-font"></i></div></label>
            <label htmlFor="control-showparenthesis" className={`sidebar-control-container ${controls.showparenthesis?'sidebar-control-container--selected':''}`}><input type="checkbox" id="control-showparenthesis" checked={controls.showparenthesis} onChange={evt => { const state = evt.target.checked; setControls(cnt => {cnt.showparenthesis=state;return {...cnt}})}}/><div className="sidebar-control_details">Show/Hide Parenthesis</div><div className="sidebar-control sidebar-control-parenthesis"><p>()</p></div></label>
            <div className="sidebar-control-container"><div className="sidebar-control_details">Reset App</div><div className="sidebar-control"><i className="fas fa-undo-alt"></i></div></div>
          </div>

        </div>


    </div>
  );
}

export default App;
