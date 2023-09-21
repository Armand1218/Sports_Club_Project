const UserLoginRoute = require("../controllers/userLogin.controllers");
const {authenticate} = require('../config/jwt.config');

module.exports = (app) => {
    app.get('/api/user/logout', authenticate , UserLoginRoute.getLogout);
    app.get("/api/user/getlogged", authenticate ,UserLoginRoute.getLogged);
    app.post("/api/user/login", UserLoginRoute.loginUser);
    app.post("/api/user/register", UserLoginRoute.createUser);
    app.put("/api/user/update", authenticate , UserLoginRoute.updateUser);
}