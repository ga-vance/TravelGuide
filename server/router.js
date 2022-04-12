const mysql = require('mysql');

const express = require('express');
var router = express.Router();

// get user login information for the database
const sql_host = process.env.MYSQL_HOST || "cpsc471_database";
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

function sendData(response, data){
  response.set("Access-Control-Allow-Origin", "*");
  response.json({
    failed: false,
    data: data,
  });
}

function sendError(response, error){
  response.set("Access-Control-Allow-Origin", "*");
  response.json({
    failed: true,
    message: error.message,
  });
}

router.get("/", (request, response) => {
  response.send("seems to be working fine!");
});

router.get("/test", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if(err){
      sendError(response, err);
      return;
    }

    conn.query("SELECT * FROM flightbooking.admin", (err, data) => {
      if(err){
        sendError(response, err);
        return;
      }

      sendData(response, data);
    });
  });
});

router.get("/flight", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if(err){
      sendError(response, err);
      return;
    }
  });
});

module.exports = router;
