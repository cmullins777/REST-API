const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const Sequelize = require('sequelize');

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err) {
      next(err);
    }
  }
};

// setup a friendly greeting for the root route
router.get('/', (req, res) => {
  res.json({ message: "REST API project"})
});

// Send a GET request to /api/courses to READ a list of courses and their user owners
router.get('/', asyncHandler(async (req, res, next) => {
    Courses.findAll({order: [["createdAt", "DESC"]]}).then((courses) => {
      res.render("courses/index", {courses: courses, users: users});
    }).catch((err) => {
      res.send(500);
    });
}));

// Send a GET request to /api/courses/:id to READ a course by ID and its matching user
router.get('/:id', asyncHandler(async (req, res, next) => {
    Course.findByPk(req.params.id).then((course => {
      if(course) {
      res.render("courses/show", {course: course, user: course.user});
      } else {
        res.send(404);
      }
    }).catch((err) => {
      res.send(500);
    }));
}));

// Send a POST request to /api/courses to CREATE a new course, sets Location header to course URI
router.post('/', asyncHandler(async(req, res, next) => {
  if(req.body.course && req.body.user){
    Course.create(req.body)
      .then(course => {
        res.redirect('/api/courses/' + course.id);
        res.status(201).end();
      }).catch((err) => {
        if(err.name === "SequelizeValidationError") {
          res.render("courses/new", {
            course: Course.build(req.body),
            user: "New User",
            error: err.errors
          });
        } else {
          throw err;
        }
      }).catch(err => {
        err.status = 400;
        next(err);
      });
     }
}));

// Send a PUT request to /api/courses/:id to UPDATE a course
router.put('/:id', asyncHandler(async(req, res, next) => {
    Course.findByPk(req.params.id).then((course) => {
      if(course) {
        return course.update(req.body);
      } else {
        res.send(404);
      }
    }).then((course) => {
        res.redirect("/courses/" + course.id);
    }).catch((err) => {
      if(err.name === "SequelizeValidationError"){
        const course = Course.build(req.body);
        course.id = req.params.id;
        res.render("courses/edit", {
          course: course,
          user: "Edit User",
          errors: err.errors
        });
      } else {
        throw err;
      }
    }).catch((err) => {
      res.send(500);
    });
}));
// Send a DELETE request to /api/courses/:id to DELETE a course
router.delete("/:id", asyncHandler(async(req, res, next) => {
    Course.findByPk(req.params.id).then((course) => {
      if(course){
        return course.destroy();
      } else {
        res.send(404);
      }
    }).then(()=> {
        res.redirect("/courses");
    }).catch((err) => {
      res.send(500);
    });
}));

module.exports = router;
