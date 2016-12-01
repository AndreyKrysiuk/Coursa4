var mongoose    = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Post = new Schema({
    username : {
      type : Schema.Types.ObjectId
    },
    cathegoty : {
      type : String,
      required : true
    },
    date : {
      type : Date,
      default : Date.now
    },
    title : {
      type : String,
      required : true,
    },
    description : {
      type : String,
      required : true
    },
    files : [{type : String}],
    comments: [{type : Schema.Types.ObjectId}],
});

var PostModel = mongoose.model('posts', Post);

module.exports.PostModel = PostModel;
