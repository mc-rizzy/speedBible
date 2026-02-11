import './speedbible.css'
import { useEffect, useRef, useState } from 'react';

export default function CheckBox({name, i, checked, onToggle}:any) {

    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        setIsChecked(newValue);
        
        if (onToggle) onToggle(newValue);
    };

    useEffect(()=>{
        if(checked)
            setIsChecked(true);
        else
            setIsChecked(false);
    },[]);

    return (
        <>
            <label key={name} className="checkboxItem" style={{ "--i": i } as React.CSSProperties}>
                <input type="checkbox" className="realCheckbox" checked={isChecked} onChange={handleToggle}/>
                <span className="customBox" />
                <span className="labelLink">{name}</span>
            </label>
        </>
    );
}