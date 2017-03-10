var express = require('express');
var router = express.Router();




router.get('/enquiry', ensureAuthenticated, function(req,res,next){
  res.render('enquiry');
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
