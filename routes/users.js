const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const User = require('../models').User;
const Sequelize = require('sequelize');
const authenticate = require('./authenticate');
const bcryptjs = require('bcryptjs');

// Send a GET request to /api/users to return the currently authenticated user
router.get('/', authenticate, (req, res) => {
  res.json({
    id: req.currentUser.id,
    firstName: req.currentUser.firstName,
    lastName: req.currentUser.lastName,
    emailAddress: req.currentUser.emailAddress
  });
  res.status(200);
});

// Send a POST request to /api/users to CREATE a new user, sets Location header to "/", returns no content
router.post('/', (req, res, next) => {
  if (!req.body.emailAddress || !req.body.password) {
      const err = new Error('Please enter a valid email address and password.');
      err.status = 400;
      next(err);
  } else {
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      password: req.body.password
  };
      newUser.password = bcryptjs.hashSync(newUser.password);
      User.create(newUser)
        .then (() => {
          res.location('/');
          res.status(201).end();
      }).catch((err) => {
         console.log(err);
          if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError" ) {
              res.status(400).json({
              err: err.errors
            })
          } else {
            err.status = 500;
            next(err);
          }
      })
    };
});

module.exports = router;
