const commentController = require('../controllers/commentController');
const {authenticate} = require('../config/jwt.config');

module.exports = app => {
    app.post('/api/createPost/:postId', authenticate, commentController.createAComment);
    app.delete('/api/deleteComment/:commentId', authenticate, commentController.deleteComment);
}