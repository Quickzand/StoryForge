import React from "react";
import TextBox from "../components/textBox.jsx";
import Button from "../components/button.jsx";
import Strings from "../constants/strings.jsx";
import ErrorMessage from "../components/errorMessage.jsx";

export default class Login extends React.Component {
	constructor(props) {
		// Variables to keep track of email and password
		super(props);
		this.state = {
			email: "",
			password: "",
			errorMessage: "",
			invalidEmail: false,
			invalidPassword: false,
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
		if (this.state.email === "" || this.state.password === "") {
			this.setState({
				invalidEmail: this.state.email === "",
				invalidPassword: this.state.password === "",
				errorMessage: "missingFields",
			});
			return;
		} else {
			this.setState({
				invalidEmail: false,
				invalidPassword: false,
				errorMessage: "",
			});
		}
		// Attempt to login
		fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
			}),
		}).then((data) => {
			if (data.status === 200) {
				// Login successful
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
				data.json().then((data) => {
					this.setState({
						errorMessage: data.error,
					});
				});
			}
		});
	}

	render() {
		var errorMessageComponent =
			this.state.errorMessage !== "" ? (
				<ErrorMessage
					error={Strings.LoginErrorMessage(this.state.errorMessage)}
				/>
			) : null;
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
						placeholder={Strings.Email()}
						name="email"
						onChange={this.handleInputChange}
						invalid={this.state.invalidEmail}
					/>
					<TextBox
						placeholder={Strings.Password()}
						type="password"
						name="password"
						onChange={this.handleInputChange}
						invalid={this.state.invalidPassword}
					/>
					{errorMessageComponent}
					<Button type="submit">{Strings.Login()}</Button>
				</form>
			</div>
		);
	}
}
