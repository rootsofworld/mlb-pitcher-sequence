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
    console.log('Data request received: /data/all')
    res.setHeader('Content-Encoding', 'gzip')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    let file = fs.createReadStream('./data/flows.json')
    file.pipe(gzip).pipe(res)

    res.on('finish', () => {
        console.log('Done')
    })
})

app.get('/data/tsne', (req, res) => {
    
    console.log('Data request received: /data/tsne')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    let file = fs.readFile('./data/tsne-r-1.json', (err, file) => {
        if(err) throw err;
        res.send(file);
    })
})

app.listen(port, (err) => {
    console.info("Server listening on port : %d", port)
})
