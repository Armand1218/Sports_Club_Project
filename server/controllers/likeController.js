const Like = require('../models/Like.model');
const jwt = require('jsonwebtoken');

module.exports = {
    likePost: (req, res) => {
        let id = jwt.decode(req.cookies.userToken);
        Like.create({userLikingPostId: id.id, postId: req.params.postId, userLikingThePostName: req.body.fullName })
            .then(like => {
                res.status(200).json(like);
            })
            .catch(err => res.status(400).json(err));
    },
    unlikePost: (req, res) => {
        Like.deleteOne({_id: req.params.likeId})
            .then(result => res.status(200).json(result))
            .catch(err => res.status(400).json(err));
    }
}