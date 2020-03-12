import React from 'react';
import './CustomCheckbox.css';



type Props = {
    checked: boolean,
    handleChange: (newValue: boolean)=>void,
    extraClasses?: string,
    tokens?: string[]
    disabled?: boolean
}

  
  
const CustomCheckbox: React.FC<Props> = ({checked, handleChange, extraClasses, tokens, disabled}) => {

    const _tokens = tokens || []
    const token1 = _tokens[0] === '' ? '' : _tokens[0] || 'Checkbox'
    const token2 = _tokens[1] || 'Selected'
    const token3 = _tokens[2] || 'Deselected'

    //Unique ID to prevent several instances of the menu on the same page to interfere with each other due to the use of label and input ids
    const uniqueID = `${new Date().getTime()}-${Math.round((Math.random()*1000))}`;

    return (
        <label htmlFor={`toggle-control-${uniqueID}`} id={`custom-checkbox-${uniqueID}`} className={`custom-checkbox-container ${checked?'custom-checkbox-container--checked':''} ${extraClasses}`}>
            <input type="checkbox" disabled={disabled} checked={checked} id={`toggle-control-${uniqueID}`} name="" onChange={evt => handleChange(evt.target.checked)}/>
            <div className="custom-checkbox-background">
                <span></span>
            </div>
            <p><span>{token1}</span>&nbsp;<span>{token3}</span> <span>{token2}</span></p>     
        </label>
    );
}

  
CustomCheckbox.defaultProps = {
    checked: false,
    extraClasses: '',
    tokens: ['Checkbox', 'Selected', 'Deselected'],
    disabled: false
}


export default CustomCheckbox;