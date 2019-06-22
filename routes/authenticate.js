'use strict';

const express = require('express');
const User = require('../models').User;
const auth = require('basic-auth');

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */
module.exports = (req, res, next) => {
  let message = null;

  // Get the user's credentials from the Authorization header.
  const credentials = auth(req);

  if (credentials) {
    User.findOne({ where: { emailAddress: credentials.name } })
      .then (user => {
        if (user) {
          let authenticated = bcryptjs.compareSync(credentials.pass, user.password);
          if (authenticated) {
            req.currentUser = user;
            next();
          } else {
            message = `Authentication failure for username: ${user.username}`;
            res.status(401);
            res.json( { message: message} );
          }
        } else {
          message = `Email not found for user: ${credentials.name}`;
          res.status(401);
          res.json( { message: message });
        }
      });
  } else {
    const err = new Error('Please enter a valid user name and email address');
    err.status = 401;
    next(err);
  }
};
