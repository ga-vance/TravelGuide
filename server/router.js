const mysql = require('mysql');

const express = require('express');
var router = express.Router();

// get user login information for the database
const sql_host = "cpsc471_database";
const sql_user = process.env.MYSQL_USER || "root";
const sql_pass = process.env.MYSQL_PASSWORD || "111111";

function generateConnection(){
  // connect to the database within network
  var conn = mysql.createConnection({
    host: sql_host,
    user: sql_user,
    password: sql_pass,
  });

  return conn;
}

router.get("/", (request, response) => {
  response.send("seems to be working fine!");
});

router.get("/test", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if(err){
      response.send(err.message);
      return;
    }
    response.send("still good");
  });
});

module.exports = router;
