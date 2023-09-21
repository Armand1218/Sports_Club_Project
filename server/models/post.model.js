const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    userPostingId: {
        type: String,
        required: [true, 'User Id is required!']
    },
    userPostingName: {
        type: String, 
        requried: [true, 'User posting name requried']
    },
    message: {
        type: String,
        required: [true, 'Message is required!']
    }
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;