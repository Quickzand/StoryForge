import React, {FC, useState} from 'react';
import styles from './components.module.css';

type NumberInputProps = {
    minumumValue: number;
    maximumValue: number;
    initialValue: number;
};

const NumberInput : FC<NumberInputProps> = ({minumumValue, maximumValue, initialValue}) => {
    const [current, setCurrent] = useState(initialValue);
    const [focused, setFocus] = useState(false);

    const handleIncrease = () => {
        if (current == maximumValue) return;

        setCurrent(current + 1);
        handleFocus();
    };

    const handleDecrease = () => {
        if (current == minumumValue) return;

        setCurrent(current - 1);
        handleFocus();
    };

    const handleFocus = () => {
        setFocus(true);
        setTimeout(() => setFocus(false), 300);
    };

    var containerClasses = [styles.numberInput, styles.glowOnHover];

    return (
        <div className={focused ? containerClasses.join(' ') + ' ' + styles.focused : containerClasses.join(' ')}>
            <NumberInputArrow direction="up" onClickHandler={handleIncrease}/>
            <div className={focused ? styles.numberInputDisplay + ' ' + styles.focused : styles.numberInputDisplay}>{current}</div>
            <NumberInputArrow direction="down" onClickHandler={handleDecrease}/>
        </div>
    );
};

type NumberInputArrowProps = {
    direction: 'up' | 'down';
    onClickHandler: () => void;
};

const NumberInputArrow : FC<NumberInputArrowProps> = ({direction, onClickHandler}) => {
    const [focused, setFocus] = useState(false);

    const clickHandler = () => {
        setFocus(true);
        setTimeout(() => setFocus(false), 300);
        onClickHandler();
    };

    var points = direction == 'up' ? '406.5 207 207 7.5 7.5 207' : '406.5 7.5 207 207 7.5 7.5';

    return (
        <svg className={focused ? styles.numberInputArrow + ' ' + styles.focused : styles.numberInputArrow} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 414 214.5" onClick={clickHandler}>
            <polyline points={points}/>
        </svg>
    );
};

export default NumberInput;