const mysql = require('mysql');

const express = require('express');
const { response } = require('express');
var router = express();
router.use(express.json());


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


// router.get("/test", (request, response) => {
//   var conn = generateConnection();
//   conn.connect((err) => {
//     if(err){
//       sendError(response, err);
//       return;
//     }

//     conn.query("SELECT * FROM flightbooking.admin", (err, data) => {
//       if(err){
//         sendError(response, err);
//         return;
//       }

//       sendData(response, data);
//     });
//   });
// });

// router.get("/flight", (request, response) => {
//   var conn = generateConnection();
//   conn.connect((err) => {
//     if(err){
//       sendError(response, err);
//       return;
//     }
//   });
// });


// Get all of the users in the database
router.get("/users", (request, response) => {
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

// Get a specific user from the database
router.get("/users/:userID", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    conn.query("SELECT * FROM flightbooking.users WHERE userID = ?", [request.params.userID], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Insert a new user into the database Create User
router.post("/users", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const parameters = request.body;
    conn.query("INSERT INTO `flightbooking`.`users` SET ?", parameters, (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Delete a user account from the database
router.delete("/users/:userID", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    conn.query("DELETE FROM flightbooking.users WHERE userID = ?", [request.params.userID], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Update user information
router.put("/users/:userID", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const { username, name, password, creditcardnumber, creditcardExpiry } = request.body;
    conn.query("UPDATE flightbooking.users SET username = ?, name = ?, password = ?, creditcardnumber = ?, creditcardExpiry = ? WHERE userID = ?", [username, name, password, creditcardnumber, creditcardExpiry,request.params.userID], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Get Flights on Origin Destination and date
router.get("/flights", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const { origin, destination, departure_date } = request.body;
    conn.query("SELECT f.flightNumber, r.origin, f.departure_date, f.departure_time, r.destination, f.arrival_date, f.arrival_time, f.airline FROM flightbooking.flight AS f INNER JOIN flightbooking.route AS r on r.name = f.route WHERE r.origin = ? AND r.destination = ? and f.departure_date = ? ORDER BY f.departure_time", [origin, destination, departure_date], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Add a new flight to the database
router.post("/flights", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const parameters = request.body;
    conn.query("INSERT INTO `flightbooking`.`flight` SET ?", parameters, (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Delete a flight from the database
router.delete("/flights/:flightnumID", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    conn.query("DELETE FROM flightbooking.flight WHERE flightnumID = ?", [request.params.flightnumID], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Update details of a flight
router.put("/flights/:flightnumID", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const parameters = request.body;
    conn.query("UPDATE `flightbooking`.`flight` SET ? WHERE flightnumID = ?", [parameters, request.params.flightnumID], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

module.exports = router;
