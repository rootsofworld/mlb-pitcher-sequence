const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

let app = express();

const port = (process.argv[2]) ? process.argv[2] : 3000;

app.use(express.static(path.resolve('static')))

app.get('/data/all', (req, res) => {
    
    let gzip = zlib.createGzip({
        windowBits: 15, 
        memLevel: 9
    });
    console.log('Data request received')
    res.setHeader('Content-Encoding', 'gzip')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    let file = fs.createReadStream('./data/pitches2018-min.json')
    file.pipe(gzip).pipe(res)

    res.on('finish', () => {
        console.log('Done')
    })
})

app.listen(port, (err) => {
    console.info("Server listening on port : %d", port)
})
