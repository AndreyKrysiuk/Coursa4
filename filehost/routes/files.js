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
						var totalPosts = posts.length,
								pageSize = 5,
								pageCount = Math.round(totalPosts/pageSize) + 1,
								currentPage = 1,
								posts2 = [],
								postsArrays = [],
								postsList = [];


							for (var i = 0; i < totalPosts; i++) {
								posts2.push(posts[i]);
							}

							while (posts2.length != 0) {
									postsArrays.push(posts2.splice(0, pageSize));
							}

							if (typeof req.query.page !== 'undefined') {
								currentPage = +req.query.page;
							}

							postsList = postsArrays[currentPage - 1];
							console.log(postsList.length);
							console.log(pageSize);
							console.log(totalPosts);
							console.log(pageCount);
							res.render('cathegory', {
								posts: postsList,
								pageSize: pageSize,
								totalPosts: totalPosts,
								pageCount: pageCount,
								currentPage: currentPage,
								title : req.params.cathegory,
								user : req.user,
								csrfToken : req.csrfToken()
							});

		} else {
			console.log(err);
			res.render('error', {error: err, user : req.user, csrfToken : req.csrfToken()});
		}
	});
});

module.exports = router;
