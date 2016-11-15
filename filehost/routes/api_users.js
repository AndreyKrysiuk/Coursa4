var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserModel = require('../user_model').UserModel;
var mongo_path = 'mongodb://localhost/course_work';
mongoose.connect(mongo_path);
/* GET users listing. */
router.get('/', function(req, res, next) {
  UserModel.find((err, users) => {
    if(!err){
      res.send('All users: \n' + users);
    } else {
      res.statusCode = 500;
      res.send('Server error');
    }
  });
});

router.get('/:id', function(req, res, next) {
  UserModel.findById(req.params.id, (err, user) => {
    if(!user){
      res.statusCode = 404;
      res.send('Not Found');
    }
    if(!err){
      res.send(user);
    } else {
      res.statusCode = 500;
      res.send('Server error');
    }
  });
});

router.put('/:id', (req,res) => {
  UserModel.findById(req.params.id, (err, user) => {
    if(!user) {
      res.statusCode = 404;
      return res.send('Not Found');
    }
    if(req.body.username !== null)
      user.username = req.body.username;
    if(req.body.password !== null)
      user.password = req.body.password;
    if(req.body.email !== null)
      user.email = req.body.email;
    if(req.body.image !== null)
      user.image = req.body.image;
    user.save((err) => {
      if(!err){
        res.send({Status : 'ok\n', user : user});
      } else {
        console.log(err);
        if(err.name == 'ValidationError') {
                 res.statusCode = 400;
                 res.send({ error: 'Validation error' });
             } else {
                 res.statusCode = 500;
                 res.send({ error: 'Server error' });
             }
      }
    });
  })
})

router.post('/', function(req, res) {
  var user = new UserModel({
    username : req.body.username,
    email : req.body.email,
    password : req.body.password,
    image : req.body.image,
  });

  user.save((err) => {
    if(!err){
      res.send({Status : 'ok\n', user : user});
    } else {
      console.log(err);
      if(err.name == 'ValidationError') {
               res.statusCode = 400;
               res.send({ error: 'Validation error' });
           } else {
               res.statusCode = 500;
               res.send({ error: 'Server error' });
           }
    }
  });
});

router.delete('/:id', (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
      if(!user){
        res.statusCode = 404;
        res.send({error : 'Not Found'});
      }
      user.remove((err) => {
        if(!err){
          res.send({Status : 'OK'});
        } else {
          res.statusCode = 500;
          res.send({error : 'Server Error'});
        }
      });
    });
});
module.exports = router;
