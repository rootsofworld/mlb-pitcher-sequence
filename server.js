const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let app = express()

const port = (process.argv[2]) ? process.argv[2] : 3000;

app.use(express.static(path.resolve('static')))

app.get('/data/all', (req, res) => {
    console.log('Data request received')
    res.sendFile(path.resolve('./pitches-r-2018.json'), (err) => {
        if(err) throw err;
        console.log("Done")
    })
})

app.listen(port, (err) => {
    console.info("Server listening on port : %d", port)
})
