import React from "react";
import TextBox from "../components/textBox.jsx";
import Button from "../components/button.jsx";

export default class Login extends React.Component {
	constructor(props) {
		// Variables to keep track of email and password
		super(props);
		this.state = {
			email: "",
			password: "",
		};

		// Bind functions to this
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// Handle input change
	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({ [name]: value });
	}

	// Handle form submission
	handleSubmit(event) {
		event.preventDefault();
		// Attempt to login
		fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: this.state.email,
				password: this.state.password,
			}),
		}).then((data) => {
			if (data.status === 200) {
				// Login successful
				// window.location.href = "/testTokenValidation";
				console.log("Login successful");
				data.json().then((data) => {
					console.log(data);
					localStorage.setItem("token", data.TOKEN);
					localStorage.setItem("user", JSON.stringify(data.user));
					console.log(data.TOKEN);
					// window.location.href = "/testTokenValidation";
				});
			} else {
				// Login failed
				console.log("Login failed");
				console.log(data);
			}
		});
	}

	render() {
		return (
			<div
				style={{
					height: "100vh",
					display: "grid",
					placeItems: "center",
					color: "black",
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
					}}
					onSubmit={this.handleSubmit}>
					<TextBox
						placeholder="Email"
						name="email"
						onChange={this.handleInputChange}
					/>
					<TextBox
						placeholder="Password"
						type="password"
						name="password"
						onChange={this.handleInputChange}
					/>
					<Button type="submit">Login</Button>
				</form>
			</div>
		);
	}
}
