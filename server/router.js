const mysql = require('mysql');
const jwt = require("jsonwebtoken");

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

function validateToken(request, response){
  var token = request.header("Authorization").split(' ').slice(-1)[0];
  var tokenString = new Buffer.from(token.split(' ').slice(-1)[0].split('.')[1], 'base64').toString('ascii')
  var tokenId = JSON.parse(tokenString).userId;
  console.log(typeof tokenId);
  try{
    if(jwt.verify(token, process.env.JWT_SECRET_KEY)){
      return tokenId;
    }
    return null;
  }catch (err){
    return null;
  }
}

router.get("/", (request, response) => {
  response.send("seems to be working fine!");
});

router.post("/user/genToken", (request, response) => {
  var conn = generateConnection();

  conn.connect((err) => {
    if(err){
      sendError(response, err);
      return;
    }

    if(!request.body){
      sendError(response, {message: "empty request body"});
      return;
    }

    const {user, pass} = request.body;
    conn.query("SELECT userId, username FROM flightbooking.users WHERE username = ? AND password = ?",
      [user, pass],
      (err, data) => {
        if(err){
          sendError(response, err);
          return;
        }

        if(data.length == 0){
          sendError(response, {message: "Username or password does not match"});
          return;
        }

        const {userId, username} = data[0];
        const token = jwt.sign({userId, username}, process.env.JWT_SECRET_KEY);

        sendData(response, {token});
      });
  });
});

router.get("/test-token", (request, response) => {
  if(!validateToken(request)){ // to check if a userId matches, compare userId === validateToken(request)
    response.sendStatus(403);
    return;
  }

  response.send("validated! working as intended");
})

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
