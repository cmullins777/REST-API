const express = require('express');
const morgan = require('morgan');
const router = express.Router();
const User = require('../models').User;
const aH = require('./courses.js');
const Sequelize = require('sequelize');

// Send a GET request to /api/users to return the currently authenticated user
router.get('/', (req, res) => {
      if(res.status(200)) {
      res.json({
        id: req.currentUser.id,
        firstName: req.currentUser.firstName,
        lastName: req.currentUser.lastName,
        emailAddress: req.currentUser.emailAddress
      });
    };
});

// Send a POST request to /api/users to CREATE a new user, sets Location header to "/", returns no content
router.post('/', (req, res, next) => {
  if(req.body.course && req.body.user){
    Course.create(req.body)
      .then(course => {
        res.redirect('/api/courses/' + course.id);
        res.status(201).end();
      }).catch((err) => {
        if(err.name === "SequelizeValidationError") {
        } else {
          throw err;
        }
      }).catch(err => {
        err.status = 400;
        next(err);
      });
     }
});

module.exports = router;
