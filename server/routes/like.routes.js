const likeController = require('../controllers/likeController');
const {authenticate} = require('../config/jwt.config');

module.exports = app => {
    app.post('/api/likePost/:postId', authenticate, likeController.likePost);
    app.delete('/api/unlikePost/:likeId', authenticate, likeController.unlikePost);
}