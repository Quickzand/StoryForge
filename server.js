const express = require("express");
const app = express();
const port = 5102; // Use a different port from your React app
const cors = require("cors");
app.use(cors());
app.use(express.json());

//require database
const db = require("./database.js");

app.listen(port, () => {
	console.log(`Express server listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
	res.send("You've reached the api");
});

app.post("/login", (req, res) => {
	var data = sanitizeData(req.body);
	console.log(req.body);
	res.send(data);
});

//test api to get all users
//make a get request to http://localhost:5102/users/add
// *===========================================================*
// |                Get All Users API			               |
// *===========================================================*
// Incoming: { email }
// Outgoing: { status }
app.get("/users", (req, res) => {
	db.all("SELECT * FROM USERS", (err, rows) => {
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

//test api to insert a user
//make a post request to http://localhost:5102/users/add
// *===========================================================*
// |                	ADD USERS API            			   |
// *===========================================================*
// Incoming: { id, username, password }
// Outgoing: { status }
app.post("/users/add", (req, res) => {
	const {id, username, password} = req.body;
	if (!id || !username || !password) {
        return res.status(400).send("Missing fields");
    }
	var data = sanitizeData(req.body);
	console.log(data);
	const sql = 'INSERT INTO USERS (USER_ID, USERNAME, PASSWORD) VALUES (?, ?, ?)';
    const params = [id, username, password];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: { id: this.lastID }
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
