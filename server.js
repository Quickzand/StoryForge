const express = require("express");
const app = express();
const port = 2363; // Use a different port from your React app

app.use(express.json());

//require database
const db = require("./database.js");
const { ok } = require("assert");

app.listen(port, () => {
	console.log(`Express server listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
	res.send("You've reached the api");
});

app.get("/test", (req, res) => {
	res.send("You've reached the api");
});

//login api
// *===========================================================*
// |                	Login API            			       |
// *===========================================================*
// Incoming: { email, pass }
// Outgoing: { status, token }
app.post("/api/login", (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).send("Missing fields");
	}
	var data = sanitizeData({ email, password });
	const sql = "CALL validate_user(?, ?)";
	const params = [data.email, data.password];
	db.query(sql, params, (err, results, fields) => {
		if (err) {
			// Handle SQL error
			return res.status(400).json({ error: "sqlError" });
		}

		const response = results[0][0];

		if (response.RESPONSE_STATUS === "Error") {
			return res.status(400).json({ error: response.RESPONSE_MESSAGE });
		} else {
			// User is valid, get token from database
			console.log("VALID LOGIN");
			return res.status(200).json(response.RESPONSE_MESSAGE);
		}
	});
});

//test api to get all users
//make a get request to http://localhost:5102/users/add
// *===========================================================*
// |                Get All Users API			               |
// *===========================================================*
// Incoming: {  }
// Outgoing: { status }
app.get("/api/users", (req, res) => {
	db.query("SELECT * FROM USER_LOGIN", (err, rows) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: "success",
			data: rows,
		});
	});
});

// *===========================================================*
// |                	USER SIGNUP API            			   |
// *===========================================================*
// Incoming: { email, password }
// Outgoing: { status }
app.post("/api/users/signup", (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: "missingFields" });
	}

	// Assuming 'sanitizeData' function is defined elsewhere to sanitize inputs
	var data = sanitizeData({ email, password });

	const sql = "CALL insert_user_login(?, ?)";
	const params = [data.email, data.password];
	db.query(sql, params, function (err, result) {
		// Handle SQL error
		if (err) {
			return res.status(400).json({ error: "sqlError" });
		}

		//extract the response from the stored procedure
		const response = result[0][0];

		if (response.RESPONSE_STATUS === "Error") {
			return res.status(400).json({ error: response.RESPONSE_MESSAGE });
		}
		return res.status(200).json({});
	});
});


// *===========================================================*
// |                	CHANGE EMAIL API           			   |
// *===========================================================*
// Incoming: { token, newEmail }
// Outgoing: { status }
app.post("/api/users/changeEmail", (req, res) => {
    const { token, newEmail } = req.body;
    if (!token || !newEmail) {
        return res.status(400).json({ error: "missingFields" });
    }

    var data = sanitizeData({ token, newEmail });

    const sql = "CALL reset_email(?, ?)";
    const params = [data.token, data.newEmail];
    db.query(sql, params, function (err, result) {
        // Handle SQL error
        if (err) {
            return res.status(400).json({ error: "sqlError" });
        }

        //extract the response from the stored procedure
        const response = result[0][0];

        if (response.RESPONSE_STATUS === "Error") {
            return res.status(400).json({ error: response.RESPONSE_MESSAGE });
        }
        return res.status(200).json(response.RESPONSE_MESSAGE);
    });
});


// *===========================================================*
// |				  TOKEN VALIDATION API          		   |
// *===========================================================*
// Incoming: { token }
// Outgoing: { status }
app.post("/api/tokenValidation", (req, res) => {
	const{token} = req.body;
	if(!token){
		return res.status(400).json({error: "missingFields"});
	}

	var data = sanitizeData({token});

	const sql = "CALL tokenValidation(?)";
	const params = [data.token];
	db.query(sql, params, function (err, result){
		// Handle SQL error
		if (err) {
			return res.status(400).json({ error: "sqlError" });
		}

		//extract the response from the stored procedure
		const response = result[0][0];

		if (response.RESPONSE_STATUS === "Error") {
			return res.status(400).json({ error: response.RESPONSE_MESSAGE });
		}

		return res.status(200).json(response.RESPONSE_MESSAGE);
	});
});


function sanitizeData(data) {
	if (typeof data === "string") {
		// String sanitization
		return data
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;")
			.replace(/'/g, "''"); // SQL Injection basic protection
	} else if (Array.isArray(data)) {
		// If it's an array, sanitize each element
		return data.map((item) => sanitizeData(item));
	} else if (typeof data === "object" && data !== null) {
		// If it's an object, sanitize each property
		const sanitizedObject = {};
		for (const key in data) {
			sanitizedObject[key] = sanitizeData(data[key]);
		}
		return sanitizedObject;
	}
	// Return data as is if it's not a string, array, or object
	return data;
}
