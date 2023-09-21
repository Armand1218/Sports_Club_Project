const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({

    postId: {
        type: String, 
        required: [true, 'Please provide the Post Id']
    },
    userCommentingId: {
        type: String,
        required: [true, 'Please provide the User commenting id']
    },
    userCommentingName: {
        type: String,
        required: [true, 'Please Provide the users name who is commenting']
    },
    message: {
        type: String,
        required: [true, 'Comments cannot be blank']
    }
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;