var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var crypto = require('crypto');
var UserModel = require('../user_model').UserModel;
var PostModel = require('../posts_model').PostModel;

var fs = require("fs");

const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');

let sessionSecret = "jahdgalsdg^&(*&^%  _Asds)";

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(busboyBodyParser({multi : true}));
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
	 res.render('main', {user : req.user});
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

router.get('/login-error', (req, res) => res.render('error', {error : 'Login error',  user : req.user}));

router.post('/update', (req, res) => {
	if(req.user === null){
		res.render('error', {error : '400. Validation error', user : null});
		return;
	}
			upload_file = req.files.file[0];
			if(req.body.email !== null)
				req.user.email = req.body.email;
			if(req.body.password.length !== 0 && req.body.password2.length !== 0) {
				if((req.body.password === req.body.password2)){
						req.user.password = hash(req.body.password);
				}
			}
			if(upload_file  !== null){
				if(req.user.image !== null){
					fs.unlink('./public/' + req.user.image);
				}
				let upload_path = './public/users_images/';
				req.user.image = upload(upload_file , req.user.username, upload_path);

			}
      req.user.save((err) => {
        if(!err){
          res.redirect('/profile');
        } else {
          console.log(err);
          if(err.name == 'ValidationError') {
                  res.render('error', {error : '400. Validation error', user: req.user,});
               } else {
                   res.render('error', {error : '500. Server error', user: req.user,});
               }
        }
      });
});


router.get('/profile', (req, res) => {
	if(req.user){
		PostModel.find({
			username : req.user.username
		}).exec((err, posts) => {
			if(!err){
					res.render('profile', {posts : posts, user : req.user});
			} else {
				console.log(err);
				res.render('error', {error: err, user : req.user});
			}
		});
	} else {
		res.redirect('/register');
	}
});

router.get('/create_post', (req, res) => {
	if(req.user)
		res.render('create_post');
		else {
			res.redirect('/register');
		}
});

router.post('/create_post', (req, res) => {
	if(req.body.title !== null && req.body.description !== null && req.files !== null){
		let files = new Array();

		let upload_path = './public/user_files/' + req.user._id + '/';
		for(var i = 0; i < req.files.files.length; i++){
			let fileObject = req.files.files[i];
			files[files.length] = {name : fileObject.name, path : '/user_files/' + req.user._id + '/' + fileObject.name };
			upload(fileObject, fileObject.name, upload_path);
		}
		new_post = new PostModel({
			username : req.user.username,
			title : req.body.title,
			description : req.body.description,
			cathegory : req.body.cathegory,
			files : files
		});
		new_post.save((err) => {
			if(!err){
				console.log("Post " + new_post._id + " created");
				res.redirect('/profile');
			} else {
				console.log(err);
				res.render('error', {error : '400. Validation error', user : req.user});
			}
		});
	}
})


function upload(fileObject, fileName, upload_path){
	let enc = fileObject.encoding;
	let fileBytes = fileObject.data;
	if(!fs.existsSync(upload_path)){
		fs.mkdirSync(upload_path);
		console.log("Dir created");
	}
		let filePath = upload_path + fileName;
		let wstream = fs.createWriteStream(filePath);
		wstream.on('finish', function () {
		});
		wstream.write(fileBytes);
		wstream.end();
};

router.get('/post/:id', (req, res) => {
    PostModel.findById(req.params.id
		).exec((err, post) => {
			if(!err){
				if (post) {
					res.render('post', {post : post, user : req.user});
				} else {
					res.render('error', {error: "404. Not Found.", user : req.user});
				}
			} else {
				console.log(err);
				res.render('error', {error: err, user : req.user});
			}
		});
});

router.post('/register', (req, res) => {
  if(req.body.password === req.body.password2){
		let fileObject = req.files.file[0];
		let fileName = req.body.username + '_' +  fileObject.name;
		let upload_path = './public/users_images/';
		upload(fileObject, fileName, upload_path);
    var new_user = new UserModel({
      username : req.body.username,
      email : req.body.email,
      password : hash(req.body.password),
      image : 'users_images/' + fileName
      });
      new_user.save((err) => {
        if(!err){
          res.redirect('/login');
        } else {
          console.log(err);
          if(err.name == 'ValidationError') {
                  res.render('error', {error : '400. Validation error', user: null,});
               } else {
                   res.render('error', {error : '500. Server error', user: null,});
               }
        }
      });
    } else {
      res.render('error', {error : 'Password is not correct. Repeat password correctly',  user : null,});
    }
});

router.get("/update_post/:id", (req, res) => {
	if(req.user){
		PostModel.findById(req.params.id).exec((err, post) => {
			if(!err){
				if(post.username === req.user.username || req.user.admin === true)
					res.render('update_post', { post: post,  user : req.user});
					else
					res.render('error', {error : "Access is denied", user : req.user});
			} else {
				console.log(err);
				res.render('error', {error: err, user : req.user});
			}
		});
	} else {
		res.render('error', {error : "Access is denied", user : req.user});
	}
});

router.post("/update_post/:id", (req, res) => {
	if(req.user){
		PostModel.findById(req.params.id).exec((err, post) => {
			if(!err){
				if(post.username === req.user.username || req.user.admin === true){
					upload_files = req.files.files;
					if(req.body.title !== null)
						  post.title = req.body.title;
					if(req.body.description !== null) {
							post.description = req.body.description;
					}
					post.cathegory = req.body.cathegory;
					if(upload_files  !== null){
						for(var i = 0; i < post.files.length; i++){
							fs.unlink('./public' + post.files[i].path);
						}
						let files = new Array();
						let upload_path = './public/user_files/' + req.user._id + '/';
						for(var i = 0; i < req.files.files.length; i++){
							let fileObject = req.files.files[i];
							files[files.length] = {name : fileObject.name, path : '/user_files/'+  req.user._id + '/' + fileObject.name };
							upload(fileObject, fileObject.name, upload_path);
						}
						post.files = files;
					}
					post.save((err) => {
						if(!err){
							res.redirect('/post/' + post._id);
						} else {
							console.log(err);
							if(err.name == 'ValidationError') {
											res.render('error', {error : '400. Validation error', user: req.user,});
									 } else {
											 res.render('error', {error : '500. Server error', user: req.user,});
									 }
						}
					});
				}
					else
					{
						res.render('error', {error : "Access is denied", user : req.user});
					}
			} else {
				console.log(err);
				res.render('error', {error: err, user : req.user});
			}
		});
	} else {
		res.redirect('/login;');
	}
});



router.get("/files/:cathegory", (req, res) => {
	PostModel.find({
		cathegory : req.params.cathegory
	}).exec((err, posts) => {
		if(!err){
				res.render('cathegory', {title : req.params.cathegory, posts: posts,  user : req.user});
		} else {
			console.log(err);
			res.render('error', {error: err, user : req.user});
		}
	});
});
module.exports = router;
