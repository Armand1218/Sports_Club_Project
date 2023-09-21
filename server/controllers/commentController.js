const Comment = require('../models/comment.model');
const jwt = require('jsonwebtoken');

module.exports = {
    
    createAComment: (req, res) => {
        let id = jwt.decode(req.cookies.userToken);
        Comment.create({userCommentingId: id.id, postId: req.params.postId,
            userCommentingName: req.body.fullName, message: req.body.commentMessage
        })
            .then(commentCreated => {
                res.status(200).json({comment: commentCreated});
            })
            .catch(err => res.status(400).json(err));
    },

    deleteComment: (req, res) => {
        Comment.deleteOne({_id: req.params.commentId})
            .then(result => res.status(200).json("Comment Deleted"))
            .catch(err => res.status(400).json(err));
    }
}