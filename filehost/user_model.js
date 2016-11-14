var mongoose    = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var User = new Schema({
    username : {
      type : String,
      required : true,
    },
    email : {
      type : String,
      required : true,
    },
    password : {
      type : String,
      required : true,
    },
    image : {
      type : String
    },
    posts : [{type : Schema.Types.ObjectId}],
});

var UserModel = mongoose.model('users', User);

module.exports.UserModel = UserModel;
