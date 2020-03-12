import React, { useState } from 'react';
import './CustomInput.css';



type Props = {
    value: string,
    handleChange: (newValue: string)=>void,
    extraClasses?: string,
    disabled?: boolean,
    placeholder?: string
}
type PropsNumber = {
    value: number,
    handleChange: (newValue: string)=>void,
    extraClasses?: string,
    placeholder?: string,
    min?: number,
    max?: number,
    disabled?: boolean,
    step?: number,
}
  
  
const CustomInputText: React.FC<Props> = ({value, handleChange, extraClasses, placeholder, disabled}) => {
    return (
        <div className={`custom-input align-self-stretch flex flex-column ${extraClasses} ${disabled ? 'custom-input--disabled': ''}`}>
            <div className='disabling-overlay' onClick={evt => {evt.stopPropagation(); evt.preventDefault()}}></div>
            <input type="text" value={value} onChange={evt=>handleChange(evt.target.value)} placeholder={placeholder}/>
            <span className="pen-icon flex-centered"><i className="fas fa-pen"></i></span>
        </div>
    );
}

const CustomInputNumber: React.FC<PropsNumber> = ({value, handleChange, extraClasses, placeholder, disabled, min, max, step}) => {
    return (
        <div className={`custom-input align-self-stretch flex flex-column ${extraClasses} ${disabled ? 'custom-input--disabled': ''}`}>
            <div className='disabling-overlay' onClick={evt => {evt.stopPropagation(); evt.preventDefault()}}></div>
            <input type="number" value={value} onChange={evt=>handleChange(evt.target.value)} min={min} max={max} step={step} placeholder={placeholder}/>
            <span className="pen-icon flex-centered"><i className="fas fa-pen"></i></span>
        </div>
    );
}


const CustomInputNumberUndefined: React.FC<PropsNumber> = ({value, handleChange, extraClasses, placeholder, disabled, min, max, step}) => {
    // This component will allow the input field to remain empty while the user is typing.
    // It is therefore agnostic of the empty/undefined/null value policy of the higher compoennt/source of truth
    // While the field is empty the last value from the source of truth is cached.
    // This only works under the assumption that the value can only change from this field, and that the source of
    // truth does not in anyway coerce/update/cahnge this value

    // To allow the field to remain empty while the user is typing
    // Give the illusion to the source of truth (higher component) that the value never becomes empty:
    // When it actually does, cache the current value received from props and send that to the source of truth
    // on subsequent re-renders until the user enters a non null value
    // thus allowing the input field to remain empty, and prevent it to be coerced to some value by a source
    // of truth that does not like empty fields...
    const willPotentiallyCacheThis: string = value.toString() 
    const [cachedValue, setCachedValue] = useState<string|undefined>()
    
    return (
        <div className={`custom-input align-self-stretch flex flex-column ${extraClasses} ${disabled ? 'custom-input--disabled': ''}`}>
            <div className='disabling-overlay' onClick={evt => {evt.stopPropagation(); evt.preventDefault()}}></div>
            <input type="number" value={cachedValue ? '' : value} onChange={evt=>{
                    if(!evt.target.value){
                        setCachedValue(willPotentiallyCacheThis);
                        handleChange(willPotentiallyCacheThis);
                    }else{
                        setCachedValue(undefined)
                        handleChange(evt.target.value);
                    }
                }} min={min} max={max} step={step} placeholder={placeholder}/>
            <span className="pen-icon flex-centered"><i className="fas fa-pen"></i></span>
        </div>
    );
}



const CustomInputTextPassword: React.FC<Props> = ({value, handleChange, extraClasses, placeholder, disabled}) => {
    return (
        <div className={`custom-input align-self-stretch flex flex-column ${extraClasses} ${disabled ? 'custom-input--disabled': ''}`}>
            <div className='disabling-overlay' onClick={evt => {evt.stopPropagation(); evt.preventDefault()}}></div>
            <input type="password" value={value} onChange={evt=>handleChange(evt.target.value)} placeholder={placeholder}/>
            <span className="pen-icon flex-centered"><i className="fas fa-pen"></i></span>
        </div>
    );
}

const CustomInputNumberPassword: React.FC<Props> = ({value, handleChange, extraClasses, placeholder, disabled}) => {
    return (
        <div className={`custom-input align-self-stretch flex flex-column ${extraClasses} ${disabled ? 'custom-input--disabled': ''}`}>
            <div className='disabling-overlay' onClick={evt => {evt.stopPropagation(); evt.preventDefault()}}></div>
            <input type="password" pattern="[0-9]*" value={value === 'NaN' ? '' : value} onChange={evt=>handleChange(evt.target.value)} placeholder={placeholder}/>
            <span className="pen-icon flex-centered"><i className="fas fa-pen"></i></span>
        </div>
    );
}



  
CustomInputText.defaultProps = {
    value: '',
    extraClasses: '',
    placeholder: 'Your Input Here',
    disabled: false
}
CustomInputNumber.defaultProps = {
    value: 0,
    extraClasses: '',
    placeholder: 'Your Input Here',
    min: -1*Number.MAX_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    step: 1,
    disabled: false
}
CustomInputTextPassword.defaultProps = {...CustomInputText.defaultProps}
CustomInputNumberPassword.defaultProps = {...CustomInputText.defaultProps}
export { CustomInputText, CustomInputNumber, CustomInputTextPassword, CustomInputNumberPassword, CustomInputNumberUndefined };