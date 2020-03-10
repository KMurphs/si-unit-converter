import React, { useRef, useState } from 'react';

import './App.css';
import AppController from './app.controller/app.controller';
import { TSIValue, TOpUnit } from './app.controller/app.types';
import { SISuffix } from './app.controller/app.native.data';


type TUiItem = {
  initialValue: TSIValue,
  initiatUnits: TOpUnit,
  targetUnits: TOpUnit,
  targetValue: TSIValue,
  author: string
}
function App() {


  let ac = useRef<AppController|null>(null);
  (ac.current === null) && (ac.current = new AppController());
  console.log('[App]: Conversion Manager Version: ', ac.current.getVersion())



  const [uiConversion, _setUiConversion] = useState<TUiItem>({
    initialValue: { mantisse: 1, exponent: 1 },
    initiatUnits: ac.current.buildOpUnit([{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
    targetUnits: ac.current.buildOpUnit([{suffix: SISuffix.DECI, symbol: 's', exponent: 2}]),
    targetValue: { mantisse: 1, exponent: 1 },
    author: ""
  })
  const setUiConversion = async (ac: AppController, currUiConversion: TUiItem,key: string, val?: TSIValue, unit?: TOpUnit, author?: string)=>{
    let curr = {...currUiConversion}

    key.toLowerCase() === "initialValue".toLowerCase() && val && (curr.initialValue = {...val})
    key.toLowerCase() === "initiatUnits".toLowerCase() && unit && (curr.initiatUnits = {...unit})
    key.toLowerCase() === "targetUnits".toLowerCase() && unit && (curr.targetUnits = {...unit})
    key.toLowerCase() === "author".toLowerCase() && author && (curr.author = author)
    key.toLowerCase() !== "author".toLowerCase() && (curr.targetValue = await ac.convert(curr.initialValue, curr.initiatUnits, curr.targetUnits))

    _setUiConversion(curr)
  }


  return (
    <div className="App">

        <div>{uiConversion.initialValue.mantisse} 10^{uiConversion.initialValue.exponent}</div>
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
        <div>{ac.current.getHistory().map(item => (<div>{JSON.stringify(item)}</div>))}</div>

    </div>
  );
}

export default App;
