import React from 'react';
import Colors from '../constants/colors.jsx';

export default class ErrorMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style = {{
                    backgroundColor: Colors.translucentBackground(),
                    margin: "0.5rem",
                    padding: "0.5rem",
                    borderRadius: "8px"
                }}>

                <p style={{ color: "red", lineHeight: "0", fontSize: "1.25rem", fontWeight: 500 }}>{this.props.error}</p>
            </div>
        );
    }
}