'use strict';

const express = require('express');
const User = require('../models').User;
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');

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
          const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
          if (authenticated) {
            req.currentUser = user;
            next();
          } else {
            message = `Authentication failure for username: ${user.username}`;
            res.status(401);
            res.json( { message: message} );
          }
        } else {
          message = `User not found for username: ${credentials.name}`;
          res.status(401);
          res.json( { message: message });
        }
      });
  } else {
    const err = new Error('Access denied');
    err.status = 401;
    next(err);
  }
};