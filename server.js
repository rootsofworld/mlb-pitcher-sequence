const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

let app = express();

const port = (process.argv[2]) ? process.argv[2] : 3000;

app.use(express.static(path.resolve('static')))

app.get('/data/all-pa', (req, res) => {
    
    let gzip = zlib.createGzip({
        windowBits: 15, 
        memLevel: 9
    });
    console.log('Data request received: /data/all-pa')
    res.setHeader('Content-Encoding', 'gzip')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    let file = fs.createReadStream('./data/all-pa-2018-withcount.json')
    file.pipe(gzip).pipe(res)

    res.on('finish', () => {
        console.log('Done')
    })
})

app.get('/data/pitcher-profile', (req, res) => {
    
    console.log('Data request received: /data/pitcher-profile')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    let file = fs.readFile('./data/pitcher-profile-t.json', (err, file) => {
        if(err) throw err;
        res.send(file);
    })
})

app.listen(port, (err) => {
    console.info("Server listening on port : %d", port)
})
