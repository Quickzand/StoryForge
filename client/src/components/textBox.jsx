import React from "react";
import Colors from "../constants/colors.jsx";
import Effects from "../constants/effects.jsx";

class TextBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			focused: false,
		};
	}

	handleFocus = () => {
		this.setState({ focused: true });
	};

	handleBlur = () => {
		this.setState({ focused: false });
	};

	render() {
		var borderColor = this.props.invalid
			? Colors.error()
			: Colors.borderColor();
		return (
			<input
				type="text"
				style={{
					backgroundColor: Colors.outsetBackground(1),
					border: "solid 2px " + borderColor,
					fontSize: "inherit",
					color: "inherit",
					padding: "0.5em",
					borderRadius: "0.5em",
					width: "100%",
					outline: "none",
					boxShadow: this.state.focused ? Effects.boxShadow() : "none",
					transition: "all 0.2s ease-in-out",
					...this.props.style,
				}}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				{...this.props}></input>
		);
	}
}

export default TextBox;
