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
			case "emailExists":
				return "Email already exists";
			case "invalidPass":
				return "Password must contain more than 8 characters";
			case "invalidEmail":
				return "Invalid Email";
			default:
				return "Sign Up failed";
		}
	}
}
