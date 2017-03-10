var express = require('express');
var router = express.Router();

router.get('/gallery', function(req,res,next){
    res.send('gallery');
});

module.exports = router;