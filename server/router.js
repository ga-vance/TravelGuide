const mysql = require('mysql');

const express = require('express');
var router = express.Router();

router.get("/", (request, response) => {
  response.send("seems to be working fine!");
});

module.exports = router;
