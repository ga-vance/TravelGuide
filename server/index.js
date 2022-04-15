const express = require('express');
const { exec } = require("child_process");

const port = process.env.PORT || 3000;

const router = require("./router.js");

const app = express();
app.use(express.json());

// allow CORS for every request
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUTS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// connect routes, defined in router.js, to appliation
app.use("/", router);

// Listen on Port 3000 or environment port
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
