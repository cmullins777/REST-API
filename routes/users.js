const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const User = require('../models').User;
const Sequelize = require('sequelize');
const authenticate = require('./authenticate');
const bcrypt = require('bcryptjs');

// Send a GET request to /api/users to return the currently authenticated user
router.get('/', authenticate, (req, res, next) => {
  User.findOne({ where: { emailAddress: req.body.emailAddress } })
  .then((users) => {
  res.status(200).json({ users });
}).catch((err) => {
  next(err);
});
});

// Send a POST request to /api/users to CREATE a new user, sets Location header to "/", returns no content
router.post('/', (req, res, next) => {
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      password: req.body.password
      };
      newUser.password = bcrypt.hashSync(newUser.password);
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
    });

module.exports = router;
