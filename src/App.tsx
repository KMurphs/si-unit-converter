import React, { useRef, useState } from 'react';

import './App.css';
import './utils.css';
import AppController from './app.controller/app.controller';
import { TSIValue, TOpUnit, TUnit } from './app.controller/app.types';
import { SISuffix } from './app.controller/app.native.data';
import SIValueEditor from './components/SIValueEditor/SIValueEditor';
import SIUnitEditor from './components/SIUnitEditor/SIUnitEditor';

declare global {
  interface Window { MathJax: any; }
}
type TUiItem = {
  initialValue: TSIValue,
  initiatUnits: TOpUnit,
  targetUnits: TOpUnit,
  targetValue: TSIValue,
  author: string
}
function App() {

  window.MathJax && console.log(window.MathJax)

  let ac = useRef<AppController|null>(null);
  (ac.current === null) && (ac.current = new AppController());
  const {unitsDefinitionsUtils, suffixUtils} = ac.current
  console.log('[App]: Conversion Manager Version: ', ac.current.getVersion())



  const [uiConversion, _setUiConversion] = useState<TUiItem>({
    initialValue: { mantisse: 1, exponent: 1 },
    initiatUnits: ac.current.buildOpUnit([{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
    targetUnits: ac.current.buildOpUnit([{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
    targetValue: { mantisse: 1, exponent: 1 },
    author: ""
  })
  const setUiConversion = async (ac: AppController, currUiConversion: TUiItem, key: string, val: any)=>{
    let curr = {...currUiConversion}

    

    key.toLowerCase() === "initialValue".toLowerCase() && val && (curr.initialValue = {...val as TSIValue})
    key.toLowerCase() === "initiatUnits".toLowerCase() && val && (curr.initiatUnits = ac.buildOpUnit(val as TUnit[]))
    key.toLowerCase() === "targetUnits".toLowerCase() && val && (curr.targetUnits = ac.buildOpUnit(val as TUnit[]))
    key.toLowerCase() === "author".toLowerCase() && val && (curr.author = val as string)
    if(key.toLowerCase() !== "author".toLowerCase()){
      const tmp = await ac.convert(curr.initialValue, curr.initiatUnits, curr.targetUnits)
                          .catch(err => console.log(err));
      tmp && (curr.targetValue = {...tmp})
    }
    
    console.log(key, curr.initiatUnits)

    _setUiConversion({...curr})
  }
  console.log(uiConversion.initiatUnits)




  return (
    <div className="App d-flex-row">

        <div className="app-container bg-red-100">


          <SIValueEditor sivalue={{...uiConversion.initialValue}} 
                         onChange={newVal=>ac.current && setUiConversion(ac.current, uiConversion, "initialValue", newVal)}
          />
        
          {
            uiConversion.initiatUnits.units.map((un, index) => { 
              return (
                <SIUnitEditor siunit={un} 
                              key={index}
                              suffixUtils={suffixUtils}
                              unitDefUtils={unitsDefinitionsUtils}
                              onChange={newVal=>{
                                const uns = uiConversion.initiatUnits.units.map((tmp, idx) => {
                                  (index === idx) && (tmp = {...newVal});
                                  return tmp;
                                })
                                ac.current && setUiConversion(ac.current, uiConversion, "initiatUnits", uns)
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




        <div className="app-sidebar bg-gray-800 text-white">
          <div className="sidebar-control-container"><div className="sidebar-control_details">Value To Convert</div><div className="sidebar-control"><i className="fas fa-sort-numeric-up"></i></div></div>
          <div className="sidebar-control-container"><div className="sidebar-control_details">Initial Units</div><div className="sidebar-control"><i className="fas fa-balance-scale"></i></div></div>
          <div className="sidebar-control-container"><div className="sidebar-control_details">Final Units</div><div className="sidebar-control"><i className="fas fa-balance-scale-right"></i></div></div>
          <div className="sidebar-control-container"><div className="sidebar-control_details">View Suffixes</div><div className="sidebar-control"><i className="fas fa-sort-amount-down"></i></div></div>
          <div className="sidebar-control-container"><div className="sidebar-control_details">View Units</div><div className="sidebar-control"><i className="fas fa-font"></i></div></div>
          <div className="sidebar-control-container"><div className="sidebar-control_details">Show/Hide Parenthesis</div><div className="sidebar-control sidebar-control-parenthesis"><p>()</p></div></div>
          <div className="sidebar-control-container"><div className="sidebar-control_details">Reset App</div><div className="sidebar-control"><i className="fas fa-undo-alt"></i></div></div>
        </div>

        {/* <div>{uiConversion.initialValue.mantisse} 10^{uiConversion.initialValue.exponent}</div>
        <div>{JSON.stringify(uiConversion.initiatUnits.units)}</div>
        <div>{JSON.stringify(uiConversion.initiatUnits.dimension)}</div>
        <div>{uiConversion.initiatUnits.baseFactor}</div>

        <div>-----------</div>

        <div>{uiConversion.targetValue.mantisse} 10^{uiConversion.targetValue.exponent}</div>
        <div>{JSON.stringify(uiConversion.targetUnits.units)}</div>
        <div>{JSON.stringify(uiConversion.targetUnits.dimension)}</div>
        <div>{uiConversion.targetUnits.baseFactor}</div>

        <div>-----------</div>
        <div>Conversion Performed by: {uiConversion.author}</div>

        <div>-----------</div>
        <div>{ac.current.getHistory().map(item => (<div>{JSON.stringify(item)}</div>))}</div> */}

    </div>
  );
}

export default App;
