var express = require('express');
var router = express.Router();



router.get('/blogs', ensureAuthenticated, function(req,res,next){
  res.render('blog');
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/user/login');
  }
}

module.exports = router;
