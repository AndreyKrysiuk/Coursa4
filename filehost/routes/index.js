var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');
var UserModel = require('../user_model').UserModel;

var salt = '13daghrnek#&$^@:"FSDK"!.vbn`139573';
function hash(pass){
  return crypto.createHash('md5').update(pass + salt).digest("hex");
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/register', (req, res) => {
  if(req.body.password === req.body.password2){
    var new_user = new UserModel({
      username : req.body.username,
      email : req.body.email,
      password : hash(req.body.password),
      image : req.body.avatar
      });
      new_user.save((err) => {
        if(!err){
          res.send({Status : 'ok\n', user : new_user});
        } else {
          console.log(err);
          if(err.name == 'ValidationError') {
                  res.render('error', {error : '400. Validation error'});
               } else {
                   res.render('error', {error : '500. Server error'});
               }
        }
      });
    } else {
      res.render('error', { error : 'Password is not correct. Repeat password correctly'});
    }
});
module.exports = router;
