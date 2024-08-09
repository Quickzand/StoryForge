// updateDB.js
const mysql = require('mysql');
const fs = require('fs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
});

fs.readFile('create_storyforge_db.sql', 'utf8', (err, data) => {
  if (err) throw err;
  connection.query(data, (err, results) => {
    if (err) throw err;
    console.log(results);
    connection.end();
  });
});