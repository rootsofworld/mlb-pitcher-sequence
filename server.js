const express = require('express');
const mongoose = require('mongoose');

let app = express()

const port = (process.argv[2]) ? process.argv[2] : 3000;

app.listen(port, (err) => {
    console.info("Server listening on port : %d", port)
})
