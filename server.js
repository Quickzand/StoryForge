const express = require("express");
const app = express();
const port = 3001; // Use a different port from your React app
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.listen(port, () => {
	console.log(`Express server listening at https://localhost:${port}`);
});

app.get("/", (req, res) => {
	res.send("You've reached the api");
});

app.post("/login", (req, res) => {
	var data = sanitizeData(req.body);
	console.log(req.body);
	res.send(data);
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
