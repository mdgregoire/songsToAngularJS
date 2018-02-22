const express = require('express');
const app = express();

// Setup body parser to handle POST body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup songs router
const songRouter = require('./routers/songs-router');
app.use('/songs', songRouter);


// Setup our static files
app.use(express.static('server/public'));

const port = 5000;
app.listen(port, function(){
  console.log(`Listening on port ${port}.`);
})
