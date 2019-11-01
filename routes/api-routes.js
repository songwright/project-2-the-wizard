// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", async function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // Route for sending data from user request, user id, and wizard answer to database
  app.post("/api/queries",function(req, res) {
    db.Request.create({
      question: req.body.question,
      answer: req.body.answer,
      user_id: req.body.id
    }).then(function(data) {
      res.json(data);
    });
  });

  app.get("/api/queries",function(req, res) {
    console.log(req.query.user_id);
    db.Request.findAll({
      where: {
        user_id: req.user.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  app.get("/api/queries/:id",function(req, res) {
    db.Request.findOne({
      where: {
        user_id: req.user.id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  app.delete("/api/queries",function(req,res) {
    db.Request.destroy({
      where: {
        user_id: req.user.id
      },truncate: true 
    }).then(function(data) {
      res.json(data);
    });
  });

  app.delete("/api/queries/:id",function(req,res) {
    db.Request.destroy({where: {id: req.params.id} }).then(function(data) {
      res.json(data);
    })
  });


};
