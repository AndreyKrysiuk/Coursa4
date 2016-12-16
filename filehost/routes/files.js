var express = require('express');
var router = express.Router();
var PostModel = require('../posts_model').PostModel;

var csrf = require('csurf');
router.use(csrf());

router.get("/:cathegory", (req, res) => {
	PostModel.find({
		cathegory : req.params.cathegory
	}).exec((err, posts) => {
		if(!err){
			  console.log(posts);
				res.render('cathegory', {title : req.params.cathegory, posts: posts,  user : req.user, csrfToken : req.csrfToken()});
		} else {
			console.log(err);
			res.render('error', {error: err, user : req.user, csrfToken : req.csrfToken()});
		}
	});
});

module.exports = router;
