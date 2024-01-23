const express = require("express");
const app = express();
const port = 5102; // Use a different port from your React app
const cors = require("cors");
app.use(cors());
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

//login api
// *===========================================================*
// |                	Login API            			       |
// *===========================================================*
// Incoming: { username, pass }
// Outgoing: { status, token }
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send("Missing fields");
    }
    var data = sanitizeData({ username, password });
    const sql = "CALL validate_user(?, ?)";
    const params = [data.username, data.password];
    db.query(sql, params, (err, results, fields) => {
        if (err) {
            // Handle SQL error
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results[0][0].STATUS === 'Invalid') {
            return res.status(400).json({ error: "Invalid username or password" });
        } else {
            // User is valid, get token from database
			return res.status(200).json(results[0][0]);
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
app.get("/users", (req, res) => {
    db.query("SELECT * FROM USER_LOGIN", (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

//test api to insert a user
//make a post request to http://localhost:5102/users/add
// *===========================================================*
// |                	ADD USERS API            			   |
// *===========================================================*
// Incoming: { username, password }
// Outgoing: { status }
app.post("/users/add", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send("Missing fields");
    }

    // Assuming 'sanitizeData' function is defined elsewhere to sanitize inputs
    var data = sanitizeData({ username, password });

    const sql = 'CALL insert_user_login(?, ?)';
    const params = [data.username, data.password];

    db.query(sql, params, function(err, result) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { id: result.insertId }
        });
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
