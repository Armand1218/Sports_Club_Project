const Post = require('../models/post.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const Like = require('../models/Like.model');
const Comment = require('../models/comment.model');

module.exports = {

    createPost: (req, res) => {
        let id = jwt.decode(req.cookies.userToken);
        Post.create({message: req.body.postMessage, userPostingId: id.id, userPostingName: req.body.fullName})
            .then(createdPost => {
                res.status(200).json(createdPost);
            })
            .catch(err => res.status(400).json(err));
    },

    deletePost: (req,res) => {
        Post.deleteOne({_id: req.params.postId})
            .then(result => res.status(200).json("User Deleted"))
            .catch(err => res.status(400).json(err));
    },

    grabAllPostsForFeedPage: (req, res) => {
        const id = jwt.decode(req.cookies.userToken);
        Post.find().sort({createdAt: "desc"})
            .then(allPosts => {
                Comment.find()
                    .then(allComments => {
                        Like.find()
                            .then(allLikes => {

                                let arrayDictionaryBeingSentToFrontEnd = [];
                                
                                for(let i = 0; i < allPosts.length; i++) {
                                    arrayDictionaryBeingSentToFrontEnd.push({numberOfLikes: 0, numberOfComments: 0 ,post: allPosts[i], userLoggedInIdAlreadyLikedPost: false, likes: undefined, comments: [] });
                                    //likes

                                    for(let j = 0 ; j < allLikes.length; j++) {
                                        
                                        if(allLikes[j].postId !== allPosts[i]._id.toString()) {
                                            continue;
                                        } else {
                                            if (allLikes[j].userLikingPostId === id.id) {
                                                arrayDictionaryBeingSentToFrontEnd[i].userLoggedInIdAlreadyLikedPost = true;
                                            }   
                                            arrayDictionaryBeingSentToFrontEnd[i].likes = allLikes[j]._id;
                                            arrayDictionaryBeingSentToFrontEnd[i].numberOfLikes++;
                                        }
                                    }
                                    for (let k = 0; k < allComments.length; k++) {
                                        if (allComments[k].postId !== allPosts[i]._id.toString()) {
                                            continue;
                                        } else {
                                            if (id.id === allComments[k].userCommentingId) {
                                                arrayDictionaryBeingSentToFrontEnd[i].numberOfComments++;
                                                arrayDictionaryBeingSentToFrontEnd[i].comments.push({userLoggedInPostedThisComment: true, userWhoPostedComment: allComments[k].userCommentingName, commentMessage: allComments[k].message, commentId: allComments[k]._id});
                                            } else {
                                                arrayDictionaryBeingSentToFrontEnd[i].numberOfComments++;
                                                arrayDictionaryBeingSentToFrontEnd[i].comments.push({userLoggedInPostedThisComment: false, userWhoPostedComment: allComments[k].userCommentingName, commentMessage: allComments[k].message});
                                            }
                                        }
                                    }
                            }
                        res.status(200).json(arrayDictionaryBeingSentToFrontEnd);
                    })
                    .catch(err => res.status(400).json(err));
                })
                .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
    },

    grabAllPostsForOneUserForProfilePage: (req,res) => {
        const id = jwt.decode(req.cookies.userToken);
        Post.find()
            .then(allPosts => {
                Comment.find()
                    .then(allComments => {
                        Like.find()
                            .then(allLikes => {  
                                let arrayDictionaryBeingSentToFrontEnd = [];
                                
                                for(let i = 0; i < allPosts.length; i++) {
                                    if (allPosts[i].userPostingId.toString() === id.id) {
                                        arrayDictionaryBeingSentToFrontEnd.push({numberOfLikes: 0, numberOfComments: 0 ,post: allPosts[i], userLoggedInIdAlreadyLikedPost: false, likes: undefined, comments: [] });

                                        for(let j = 0 ; j < allLikes.length; j++) {
                                            if(allLikes[j].postId !== allPosts[i]._id.toString()) {
                                                continue;
                                            } 
                                            if (allLikes[j].userLikingPostId.toString() === id.id) {
                                                arrayDictionaryBeingSentToFrontEnd[arrayDictionaryBeingSentToFrontEnd.length-1].userLoggedInIdAlreadyLikedPost = true;
                                            }   
                                            arrayDictionaryBeingSentToFrontEnd[arrayDictionaryBeingSentToFrontEnd.length-1].likes = allLikes[j]._id;
                                            arrayDictionaryBeingSentToFrontEnd[arrayDictionaryBeingSentToFrontEnd.length-1].numberOfLikes++;
                                            
                                        }
                                        for (let k = 0; k < allComments.length; k++) {
                                            if (allComments[k].postId !== allPosts[i]._id.toString()) {
                                                continue;
                                            } else {
                                                if (id.id === allComments[k].userCommentingId) {
                                                    arrayDictionaryBeingSentToFrontEnd[arrayDictionaryBeingSentToFrontEnd.length-1].numberOfComments++;
                                                    arrayDictionaryBeingSentToFrontEnd[arrayDictionaryBeingSentToFrontEnd.length-1].comments.push({userLoggedInPostedThisComment: true, userWhoPostedComment: allComments[k].userCommentingName, commentMessage: allComments[k].message, commentId: allComments[k]._id});
                                                } else {
                                                    arrayDictionaryBeingSentToFrontEnd[arrayDictionaryBeingSentToFrontEnd.length-1].numberOfComments++;
                                                    arrayDictionaryBeingSentToFrontEnd[arrayDictionaryBeingSentToFrontEnd.length-1].comments.push({userLoggedInPostedThisComment: false, userWhoPostedComment: allComments[k].userCommentingName, commentMessage: allComments[k].message});
                                                }
                                            }
                                        }
                                    }
                                }
                                if (arrayDictionaryBeingSentToFrontEnd === []) {
                                    res.status(200).json(null);
                                }
                                res.status(200).json(arrayDictionaryBeingSentToFrontEnd);
                            })
                        .catch(err => res.status(400).json({err: err, message: "Like Error"}));
                    })
                .catch(err => res.status(400).json({err: err, message: "Post Error"}))
            })
            .catch(err => res.status(400).json({err: err, message: "grabbing posts error"}))
    }

};