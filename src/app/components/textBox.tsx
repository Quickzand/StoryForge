import React, {FC, useState} from 'react';
import styles from './components.module.css';

type TextBoxProps = {
    label: string;
    placeholder: string;
}

const TextBox : FC<TextBoxProps> = ({label, placeholder}) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
    };

    var inputClasses = [styles.textBoxInput, styles.glowOnHover];
    
    return (
        <div className={styles.textBox}>
            <label className={focused ? styles.textBoxLabel + ' ' + styles.focused : styles.textBoxLabel}>{label}</label>
            <input className={focused ? inputClasses.join(' ') + ' ' + styles.focused : inputClasses.join(' ')} type="text"  placeholder={placeholder} onFocus={handleFocus} onBlur={handleBlur}></input>
        </div>
    );
}

export default TextBox;