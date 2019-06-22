'use strict';

// load modules
const express = require('express');
const Sequelize = require('sequelize');
const morgan = require('morgan');
const models = require('./models').sequelize;

/*  ASK about this - what is it doing?
let path = require('path');
const records = path + './fsjstd-restapi.db';
*/

// construct the database  - ASK about this too
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./fsjstd-restapi.db"
});

// Use authenticate method to test connection to database
sequelize
  .authenticate()
  .then((err) => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

// create the Express app
const app = express();


// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Setup api routes
app.use('/api', require('./routes/index'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/users', require('./routes/users'));

// send 404 if no other route matched
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    }
  })
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
