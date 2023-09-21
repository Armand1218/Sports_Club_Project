const postController = require('../controllers/postController');
const {authenticate} = require('../config/jwt.config');

module.exports = app => {
    app.post('/api/createPost', authenticate, postController.createPost);
    app.get('/api/grabAllPosts', authenticate, postController.grabAllPostsForFeedPage);
    app.get('/api/grabPostsForLoggedUser', authenticate, postController.grabAllPostsForOneUserForProfilePage);
    app.delete('/api/deletePost/:postId', authenticate, postController.deletePost);
}