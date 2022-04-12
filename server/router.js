const mysql = require('mysql');

const express = require('express');
const { response } = require('express');
// var router = express.Router();
var router = express();
router.use(express.json());
router.use(express.urlencoded());

// get user login information for the database
// const sql_host = process.env.MYSQL_HOST || "cpsc471_database";
// const sql_user = process.env.MYSQL_USER || "root";
// const sql_pass = process.env.MYSQL_PASSWORD || "111111";

// Greg's development credentials
const sql_host = "localhost";
const sql_user = "root";
const sql_pass = "password";

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

// Get all of the users from the database
router.get("/getusers", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    conn.query("SELECT * FROM flightbooking.users", (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});



module.exports = router;
