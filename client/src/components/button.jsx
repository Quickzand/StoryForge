import React, { FC, useState } from "react";
import Colors from "../constants/colors.jsx";
import Effects from "../constants/effects.jsx";

class Button extends React.Component {
	constructor(props) {
		super(props);
		// Set up styles
		this.state = {
			isHovered: false,
			isPressed: false,
		};
	}
	// Handle hover
	handleHover = () => {
		this.setState({ isHovered: true });
	};
	handleUnhover = () => {
		this.setState({ isHovered: false });
	};

	render() {
		return (
			<button
				className={this.props.className}
				style={{
					color: "white",
					backgroundColor: Colors.accent(),
					borderRadius: "0.5rem",
					cursor: "pointer",
					padding: "0.5rem",
					transition: "all 0.2s ease-in-out",
					fontSize: "inherit",
					border: "solid 1px ",
					width: "100%",
					color: "inherit",
					boxShadow: this.state.isHovered
						? Effects.boxShadow()
						: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
					scale: this.state.isHovered ? "1.01" : "1",
					...this.props.style,
				}}
				onMouseEnter={this.handleHover}
				onMouseLeave={this.handleUnhover}
				{...this.props}>
				{this.props.children}
			</button>
		);
	}
}

export default Button;
