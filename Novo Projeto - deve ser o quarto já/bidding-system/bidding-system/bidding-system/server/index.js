const express = require('express');

const app = express();

const PORT = 4000;

const fs = require('fs');

const http = require('http').Server(app);

const cors = require('cors');

const socketIO = require('socket.io')(http, {

  cors: {

    origin: 'http://localhost:3000',

  },

});


//Gets the JSON file and parse the file into JavaScript object

const rawData = fs.readFileSync('data.json');

const productData = JSON.parse(rawData);


app.use(cors());


socketIO.on('connection', (socket) => {

  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('disconnect', () => {

    console.log('🔥: A user disconnected');

  });


  socket.on('addProduct', (data) => {

    productData['products'].push(data);

    const stringData = JSON.stringify(productData, null, 2);

    fs.writeFile('data.json', stringData, (err) => {

      console.error(err);

    });

  });


  //Listens for new bids from the client

  socket.on('bidProduct', (data) => {

    console.log(data);

  });

});


//Returns the JSON file

app.get('/api', (req, res) => {

  res.json(productData);

});


http.listen(PORT, () => {

  console.log(`Server listening on ${PORT}`);

});