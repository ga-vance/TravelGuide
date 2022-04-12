const express = require('express');
const { exec } = require("child_process");

const port = process.env.PORT || 3000;

// initialize database
exec("mysql --user=$MYSQL_USER --password=$MYSQL_PASSWORD -h cpsc471_database flightbooking < ./CPSC471Project.sql");

const router = require("./router.js");

const app = express();
// connect routes, defined in router.js, to appliation
app.use("/", router);

// Listen on Port 3000 or environment port
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
