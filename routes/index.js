var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var multer = require('multer');


var gallery = require('../models/gallery');
var crypto = require('crypto');


router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res, next) {
  res.render('index');
  
});

router.get('/admin', ensureAuthenticated,function(req, res, next) {
  res.render('admin');
  
});


router.get('/blogs', ensureAuthenticated,function(req, res, next) {
  res.render('blog');
  
});

var portfolio_img = [];
router.get('/gallery', ensureAuthenticated,function(req, res, next) {
  res.render('gallery');

  gallery.find({}, function(err, res){
    if(err){
      res.status(500);
    }
    else{
      console.log(res);
      portfolio_img = res;
      
    }
  });
  
});

router.post('/gallery',function(req,res,next){
  console.log(req.files);
  var storage = multer.diskStorage({
  destination: function(req, files, cb){
    cb(null, 'public/uploads/')
  },
  filename: function(req,files,cb){
    cb(null, Date.now() + files.originalname );
  }
});

var upload = multer({storage: storage});
var cpUpload = upload.any();
cpUpload(req,res,function(uploadError){
  if(uploadError){
    console.log("error",uploadError);
  }
  else{
    console.log("saved", req.files.length);
    for(var i = 0; i < req.files.length ; i++){
       var path = req.files[i].path;
    var imageName = req.files[i].originalname;

    var imagepath = {};
    imagepath['path'] = path;
    imagepath['originalname'] = imageName;
    gallery.create(imagepath, function(err,res){
      
    });
    }
    res.redirect('/gallery');
  }
});
  
  
});

router.get('/enquiry', ensureAuthenticated,function(req, res, next) {
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
