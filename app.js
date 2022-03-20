//Happy new year
//BY Mohammad Pourfooladi

const express = require('express');
const app = express();
app.use(express.static('public'));

const http = require('http');
let myPort = process.env.PORT || 3000;

app.set('port', myPort);

const server = http.createServer(app);
server.on('listening', ()=> {
  console.log('listening on port 3000');
});

server.listen(myPort, "0.0.0.0");
