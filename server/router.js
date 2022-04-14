const mysql = require('mysql');
const jwt = require("jsonwebtoken");

const express = require('express');
const { response } = require('express');
var router = express();
router.use(express.json());


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

router.post("/users/genToken", (request, response) => {
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

    var dataSent = false;
    const {user, pass} = request.body;
    conn.query("SELECT userId, username FROM flightbooking.users WHERE username = ? AND password = ?",
      [user, pass],
      (err, data) => {
        if(err){
          sendError(response, err);
          return;
        }

        if(data.length == 0){
          // this means that the user is likely not a customer, may be an admin
          return;
        }

        const {userId, username} = data[0];
        const token = jwt.sign({
          userId,
          username,
          isAdmin: false,
        }, process.env.JWT_SECRET_KEY);

        sendData(response, {token});
        dataSent = true;
    });

    conn.query("SELECT adminId, username FROM flightbooking.admin WHERE username = ? AND password = ?",
      [user, pass],
      (err, data) => {
        if(err){
          sendError(response, err);
          return;
        }

        if(data.length == 0){
          // this means that the user is not an administator, may be a customer
          return;
        }

        const {adminId, username} = data[0];
        console.log(data[0]);
        const token = jwt.sign({
          userId: adminId,
          username,
          isAdmin: true,
        }, process.env.JWT_SECRET_KEY);

        sendData(response, {token});
        dataSent = true;
    });

    setTimeout(() => {
      if(!dataSent)
          sendError(response, {message: "Username or password does not match"});
    }, 1000); // wait 1 second to see if the token has been sent
  });
});

router.get("/test-token", (request, response) => {
  if(!validateToken(request)){ // to check if a userId matches, compare userId === validateToken(request)
    response.sendStatus(403);
    return;
  }

  response.send("validated! working as intended");
})

// Get all of the users in the database. Admin functionality
// Just query the route with no body get the information back
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
// Query the route/userID to get that users information back
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
// This route takes a JSON object that includes the users information in the following format
// {username:String,name:String,password:String,creditcardnumber:String,creditcardExpiry:String(dd/dd)}
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
// send to users/userID and that user will be romoved from the database
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
// This takes a JSON object with all of the same information to create a new user
// {username:String,name:String,password:String,creditcardnumber:String,creditcardExpiry:String(dd/dd)}
// Even if not all the information is being changed, all of the information needs to be send including information
// that hasn't changed
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
// Query this route with a JSON object in format
// {origin:String,destination:String,departure_date:date(YYYY-MM-DD)}
router.get("/flights", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const { origin, destination, departure_date } = request.body;
    conn.query("SELECT f.flightnumID, f.airline, f.flightNumber, r.origin, f.departure_date, f.departure_time, r.destination, f.arrival_date, f.arrival_time FROM flightbooking.flight AS f INNER JOIN flightbooking.route AS r ON r.name = f.route WHERE r.origin = ? AND r.destination = ? and f.departure_date = ? ORDER BY f.departure_time", [origin, destination, departure_date], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Add a new flight to the database  Admin Functionality
// Takes a JSON object formatted
// {"airline": String,"flightNumber": String,"route": String,"departure_date": Date (YYYY-MM-DD),"departure_time": TIME (HH:MM:ss (24HR)),"arrival_date": Date (YYYY-MM-DD),"arrival_time": TIME (HH:MM:ss (24HR)),"aircraft": INT}
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

// Delete a flight from the database Admin Functionality
// Include the flightnumID in the route to delete that flight
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

// Update details of a flight Admin Functionality
// Include the flight number in the route as well as a JSON object including all information about the flight formatted
// {"airline": String,"flightNumber": String,"route": String,"departure_date": Date (YYYY-MM-DD),"departure_time": TIME (HH:MM:ss (24HR)),"arrival_date": Date (YYYY-MM-DD),"arrival_time": TIME (HH:MM:ss (24HR)),"aircraft": INT}
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

// Add Frequent Flier status
// Takes a JSON object formatted
// {"customerID" : INT,"airline": String,"tier": STRING}
router.post("/frequentFlier", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const parameters = request.body;
    conn.query("INSERT INTO `flightbooking`.`frequentFlier` SET ?", parameters, (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Get frequent flier statuses of a customer Takes the userID number and returns all of their freqflier statuses
router.get("/frequentFlier/:customerID", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    conn.query("SELECT * FROM flightbooking.frequentFlier WHERE customerID = ?", [request.params.customerID], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Give a rating to an Airline (Create Rating entry)
// Takes a JSON object formatted
// {"airline_name": String,"rating": INT (max 5)}
router.post("/ratings", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const parameters = request.body;
    conn.query("INSERT INTO `flightbooking`.`airlineRatings` SET ?", parameters, (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Get average rating of an Airline. Returns the average of all ratings for that airline to 1 decimal place
// Takes the airline name as a JSON object {"airline_name": String}
router.get("/ratings", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const { airline_name } = request.body;
    conn.query("SELECT airline_name, ROUND(AVG(rating),1) 'rating' FROM flightbooking.airlineRatings WHERE airline_name = ? GROUP BY airline_name", airline_name, (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// "Book" (create) a reservation
// Takes a JSON object formatted 
// {"flightNumID": INT,"customerID" : INT,"seat_number": String,"luggage": INT}
router.post("/reservation", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const parameters = request.body;
    conn.query("INSERT INTO flightbooking.reservation SET ?", parameters, (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// "cancel" (delete) a reservation
// Takes the reservation number as part of the URL path and will delete that reservation
router.delete("/reservation/:reservation_number", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    conn.query("DELETE FROM flightbooking.reservation WHERE reservation_number = ?", [request.params.reservation_number], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// See all reservations of a user
// Takes the userID as part of the URL path and returns all of that users reservations
router.get("/reservation/:userID", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    conn.query("SELECT r.reservation_number, f.airline, f.flightNumber, f.route, f.departure_date, f.departure_time, r.seat_number, r.luggage FROM flightbooking.reservation AS r INNER JOIN flightbooking.flight AS f ON r.flightNumID = f.flightnumID WHERE r.customerID = ?", [request.params.userID], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// See all reservations of a flight Admin Functionality
// Send the flightnumID as part of the URL path and get all reservations registered for that flight
router.get("/flightreservation/:flightNumID", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    conn.query("SELECT r.reservation_number, u.name, f.airline, f.flightNumber, f.route, f.departure_date, f.departure_time, r.seat_number, r.luggage FROM flightbooking.reservation AS r INNER JOIN flightbooking.flight AS f ON r.flightNumID = f.flightnumID INNER JOIN flightbooking.users AS u ON r.customerID = u.userID WHERE r.flightNumID = ?", [request.params.flightNumID], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Create new Admin Account. Admin Functionality
// This route takes a JSON object that includes the Admin information in the following format
// {name:String,username:String,password:String}
router.post("/admin", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const parameters = request.body;
    conn.query("INSERT INTO `flightbooking`.`admin` SET ?", parameters, (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});


// Delete Admin Account. Admin Functionality
// send to admin/adminID and that admin will be romoved from the database
router.delete("/admin/:adminID", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    conn.query("DELETE FROM flightbooking.admin WHERE adminID = ?", [request.params.adminID], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Get all Admin accounts. Admin Functionality
// Just query the route with no body get the information back
router.get("/admin", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    conn.query("SELECT * FROM flightbooking.admin", (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

// Update the admin account information
// Takes a JSON object
// formatted {name:String,username:String,password:String}
router.put("/admin/:adminID", (request, response) => {
  var conn = generateConnection();
  conn.connect((err) => {
    if (err) {
      sendError(response, err);
      return;
    }
    const parameters = request.body;
    conn.query("UPDATE `flightbooking`.`admin` SET ? WHERE adminID = ?", [parameters, request.params.adminID], (err, data) => {
      if (err) {
        sendError(response, err);
        return;
      }
      sendData(response, data);
    });
  });
});

module.exports = router;
