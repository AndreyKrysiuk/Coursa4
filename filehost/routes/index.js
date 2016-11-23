var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mpromise = require('mpromise');
var crypto = require('crypto');
var UserModel = require('../user_model').UserModel;

const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');

let sessionSecret = "jahdgalsdg^&(*&^%  _Asds)";

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(busboyBodyParser({ limit: '5mb' }));
router.use(cookieParser());
router.use(session({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log("deserializeUser id: " + id);
	UserModel.findOne({ _id: id}).exec((err, user) => {
    if(err){
      done(err, null);
    } else {
      if(user) {
				done(null, user);
			} else {
				done("No user", null);
			}
    }
  });
});

passport.use(new LocalStrategy((username, password, done) => {
	  console.log("Local: " + username + " : " + password);
	  UserModel.findOne({
			  username: username,
			  password: hash(password)
		  }).exec((err, user) => {
        if(!err){
          console.log(user);
  				if (user) {
  					done(null, user);
  				} else {
  					done(null, false);
  				}
        } else {
          console.log(err);
  				done(err, null);
        }
      });
}));


var salt = '13daghrnek#&$^@:"FSDK"!.vbn`139573';
function hash(pass){
  return crypto.createHash('md5').update(pass + salt).digest("hex");
}
/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user) res.render('main_s');
	else res.render('main');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.post('/login',
	passport.authenticate('local', { failureRedirect: '/login-error' }),
  (req, res) => res.redirect('/'));

router.get('/login-error', (req, res) => res.end("Login error"));

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
