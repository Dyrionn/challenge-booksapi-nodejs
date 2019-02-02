var express = require('express');
const config = require('../config');
const port = config.config.port

var healthcheckRouter = require('./routes/healthcheck');
var booksRouter = require('./routes/books');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/status', healthcheckRouter);
app.use('/', booksRouter);

app.listen(port,() => console.log(`Listening on port: ${port}`));