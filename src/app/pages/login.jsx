import React from "react";
import TextBox from "../components/textBox.jsx";
import Button from "../components/button.jsx";

export default class Login extends React.Component {
	render() {
		return (
			<div
				style={{
					height: "100vh",
					display: "grid",
					placeItems: "center",
				}}>
				<form
					style={{
						display: "inline-flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						height: "100%",
						minWidth: "20em",
						gap: "1em",
						fontSize: "1.25rem",
					}}>
					<TextBox placeholder="Email" name="email" />
					<TextBox placeholder="Password" type="password" name="password" />
					<Button type="submit">Login</Button>
				</form>
			</div>
		);
	}
}
