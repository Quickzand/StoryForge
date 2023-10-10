import React, {FC, useState} from 'react';
import styles from './components.module.css';

type ButtonProps = {
    onClickHandler: () => void;
}

const Button : FC<ButtonProps> = ({onClickHandler}) => {
    const [focused, setFocused] = useState(false);
    const buttonClasses = [styles.button, styles.glowOnHover];

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
    };

    return <button className={focused ? buttonClasses.join(' ') + ' ' + styles.focused : buttonClasses.join(' ')} onClick={onClickHandler} onFocus={handleFocus} onBlur={handleBlur}>Button</button>;
}

export default Button;