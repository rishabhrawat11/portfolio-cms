var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var Admin = require('../models/admin');

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', function(req,res,next){
  res.render('../views/login');
});

//Register users
router.post('/register', function(req,res,next){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var confirmPassword = req.body.password2;

  //validation
  req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var error = req.validationErrors();

  if(error){
		res.render('register',{
			errors:errors
		});
	}
  else {
    var newAdmin = new Admin({
      name: name,
      email: email,
      username: username,
      password: password
    });
  }
  Admin.createAdmin(newAdmin, function(err, admin){
    if(err){
      res.status(500)
    }
    else{
      req.flash('success_msg', 'You are registered and can now login');
      res.redirect('/user/login');
    }
  });
});

passport.use(new localStrategy(
  function(username, password, done) {
   Admin.getAdminByUsername(username, function(err, admin){
      if(err){
        res.status(500);
      }
      if(!admin){
        return done(null, false,{message:'unknown User or wrong password'});
      }

      Admin.comparePassword(password, admin.password, function(err, isMatch){
        if(err){
          res.status(500);
        }

        if(isMatch){
          return done(null, admin);
        }

        else{
          return done(null, false, {message: 'unknown user or wrong password'})
        }
      });
   });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Admin.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('local',{successRedirect:'/', failureRedirect:'/user/login', failureFlash: true}),
function(req,res,next){
  res.redurect('/');
});

router.get('/logout', function(req,res,next){
  req.logout();
  req.flash('success_msg','You are logged out');
  res.redirect('/user/login');
});

module.exports = router;
