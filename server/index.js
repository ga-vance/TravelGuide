const express = require('express');
const { exec } = require("child_process");

// initialize database
exec("mysql --user=$MYSQL_USER --password=$MYSQL_PASSWORD -h cpsc471_database flightbooking < ./CPSC471Project.sql");
const router = require("./router.js");
const app = express();

// connect routes, defined in router.js, to appliation
app.use("/", router);

app.listen('3000', () => {
    console.log('Server started on port 3000');
});
