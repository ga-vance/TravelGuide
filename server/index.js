const express = require('express');
const router = require("./router.js");


const app = express();

// connect routes, defined in router.js, to appliation
app.use("/", router);

app.listen('3000', () => {
    console.log('Server started on port 3000');
});
