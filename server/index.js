const express = require('express');
const mysql = require('mysql');

const port = process.env.PORT || 3000;


// MySQL connection
const db = mysql.createConnection({
    host            : 'localhost',
    user            : 'root', 
    password        : 'password', 
    database        : 'CPSC471Project'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL')

});

const app = express();
// Listen on Port 3000 or environment port
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});