const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

let app = express()

const port = (process.argv[2]) ? process.argv[2] : 3000;

app.use(express.static(path.resolve('static')))

app.listen(port, (err) => {
    console.info("Server listening on port : %d", port)
})
