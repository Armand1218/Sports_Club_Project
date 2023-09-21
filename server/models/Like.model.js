const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    userLikingPostId: {
        type: String,
        required: [true, 'Please provide the user liking the post id']
    },
    userLikingThePostName: {
        type: String,
        required: [true, 'Please provide the users name']
    },
    postId: {
        type: String,
        required: [true, 'Please provide the post id']
    }
}, {timestamps: true})

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
