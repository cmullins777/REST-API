const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const Sequelize = require('sequelize');
const authenticate = require('./authenticate');

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err) {
      next(err);
    }
  }
};

// Send a GET request to /api/courses to READ a list of courses and their user owners
router.get('/', asyncHandler(async (req, res, next) => {
    Course.findAll({
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: [{model: User,
               attributes: ['id', 'firstName', 'lastName', 'emailAddress']}]})
      .then((courses) => {
      res.status(200).json ({ courses: courses });
    }).catch((err) => {
      next(err);
    });
}));

// Send a GET request to /api/courses/:id to READ a course by ID and its matching user
router.get('/:id', asyncHandler(async (req, res, next) => {
    Course.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: [{model: User,
               attributes: ['id', 'firstName', 'lastName', 'emailAddress']}]})
      .then((course) => {
        if(course) {
          res.status(200).json({ course: course });
      } else {
        err.status = 400;
        next(err);
      }
  });
}));

// Send a POST request to /api/courses to CREATE a new course, sets Location header to course URI
router.post('/', authenticate, asyncHandler(async(req, res, next) => {
    Course.create(req.body)
      .then(course => {
        res.location('/api/courses/' + course.id);
        res.status(201).end();
      }).catch((err) => {
        if(err.name === "SequelizeValidationError") {
          res.status(400).json({
            err: err.errors
        });
      } else {
          err.status = 500;
          next(err);
        }
      });
}));

// Send a PUT request to /api/courses/:id to UPDATE a course
router.put('/:id', authenticate, asyncHandler(async(req, res, next) => {
  Course.findOne({
    where: { id: req.params.id }
    }).then((course) => {
      if(course) {
        if(err.name === "SequelizeValidationError") {
          console.log(err);
          const err = new Error;
          res.status(400).json({
            err: err.errors
        });
        } else {
          course.update(req.body);
          res.location("/courses/" + req.body.id);
          res.status(204).end();
        }
      } else {
        err.status = 400;
        next(err);
      }
    }).catch((err) => {
      console.log(err);
      err.status = 500;
      next(err);
    });
}));

// Send a DELETE request to /api/courses/:id to DELETE a course
router.delete("/:id", authenticate, asyncHandler(async(req, res, next) => {
  Course.findOne({
    where: { id: req.params.id},
    }).then((course) => {
      if(course){
        return course.destroy();
      }
    }).then(()=> {
        res.status(204).end();
    }).catch((err) => {
      err.status = 400;
       next(err);
    });
}));

module.exports = router;
