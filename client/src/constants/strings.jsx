export default class Strings {
	static Email() {
		return "Email";
	}
	static Password() {
		return "Password";
	}
	static Login() {
		return "Login";
	}
	static Submit() {
		return "Submit";
	}
	static Signup() {
		return "Sign Up";
	}
	static EmailInvalidError() {
		return "Please enter a valid email address.";
	}
	static SignupErrorMessage(errorMessage) {
		switch (errorMessage) {
			case "duplicateEmail":
				return "Email already exists";
			case "invalidPass":
				return "Password must contain more than 8 characters";
			case "invalidEmail":
				return "Invalid Email";
			case "missingFields":
				return "Email and Password are required";
			default:
				return "Sign Up failed";
		}
	}
	static LoginErrorMessage(errorMessage) {
		switch (errorMessage) {
			case "invalidCredentials":
				return "Your email or password is incorrect";
			case "missingFields":
				return "Email and Password are required";
			default:
				return "Login failed";
		}
	}
}
