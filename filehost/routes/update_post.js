var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PostModel = require('../posts_model').PostModel;

var csrf = require('csurf');
router.use(csrf());

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

router.get("/:id", (req, res) => {
	if(req.user){
		PostModel.findById(req.params.id).exec((err, post) => {
			if(!err){
				if(post.username === req.user.username || req.user.admin === true)
					res.render('update_post', { post: post,  user : req.user, csrfToken : req.csrfToken()});
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

router.post("/:id", (req, res) => {
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
						var user_creator = UserModel.findOne({username : post.username}, function(err, user){
							if(!err){
								return user;
							} else {
								res.render('error', {error : '500. Server error', user: req.user});
							}
						});
						let files = new Array();
						let upload_path = nconf.get("upload_pathes:files") + req.user._id + '/';
						for(var i = 0; i < req.files.files.length; i++){
							let fileObject = req.files.files[i];
							files[files.length] = {name : fileObject.name, path : '/user_files/'+  user_creator._id + '/' + fileObject.name };
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


module.exports = router;
