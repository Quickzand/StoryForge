import React from "react";
import TextBox from "../components/textBox.jsx";
import Button from "../components/button.jsx";
import Strings from "../constants/strings";
import ErrorMessage from "../components/errorMessage.jsx";

export default class Signup extends React.Component {
	constructor(props) {
		// Variables to track signup information
		super(props);
		this.state = {
			email: "",
			password: "",
			errorMessage: "",
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setErrorMessage = this.setErrorMessage.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({ [name]: value });
	}

	handleSubmit(event) {
		event.preventDefault();

		// Check for valid email
		let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		if (!this.state.email.match(emailRegex)) {
			this.setErrorMessage(Strings.EmailInvalidError());
			return;
		}

		fetch("/api/users/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
			}),
		}).then((data) => {
			// Check for successful signup
			if (data.status === 200) {
				data.json().then((data) => {
					console.log(data);
				});
			} else if (data.status === 400) {
				console.log(data);
				data.json().then((data) => {
					this.setErrorMessage(Strings.SignupErrorMessage(data.error));
				});
			}
		});
	}

	setErrorMessage(message) {
		this.setState({ errorMessage: message });
	}

	render() {
		let errorMessageComponent =
			this.state.errorMessage !== "" ? (
				<ErrorMessage error={this.state.errorMessage} />
			) : (
				""
			);

		return (
			<div
				style={{
					height: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					color: "black",
				}}>
				<h1>Sign Up</h1>
				<form
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: "1rem",
						minWidth: "20rem",
						fontSize: "1.25rem",
					}}
					onSubmit={this.handleSubmit}>
					<TextBox
						placeholder={Strings.Email()}
						name="email"
						onChange={this.handleInputChange}
					/>
					<TextBox
						placeholder={Strings.Password()}
						name="password"
						onChange={this.handleInputChange}
					/>
					<Button type="submit">{Strings.Signup()}</Button>
				</form>
				{errorMessageComponent}
			</div>
		);
	}
}
