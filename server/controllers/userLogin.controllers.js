const user = require("../models/user.model.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    
    createUser: (req, res) => {
        user.create(req.body)
            .then((createdUser) => { 
                // use schema data to create payload
                // create a token
                const cookie = jwt.sign({
                    id: createdUser._id
                }, process.env.SECRET);
        
                res.cookie('userToken', cookie, {
                    httpOnly: true
                }).json({msg: "success", user: createdUser, token: cookie});
            })
                
            .catch((err) => {
                res.status(400).json({err});
            });
    },

    updateUser: (req, res) => {
        const id = jwt.decode(req.cookies.userToken); 
        user.findByIdAndUpdate({
            _id: id.id
        }, req.body, {new:true, runValidators: true})
            .then((updatedUser) => {
                res.json(updatedUser);
            })
            .catch((err) => {
                res.status(400).json({err});
            });
    },

    loginUser: async(req, res) => {
        const User = await user.findOne({email: req.body.email});

        if (User === null) {
            return res.status(400).json({email: "Email is incorrect!"})
        }

        const passwordInDB = await bcrypt.compare(req.body.password, User.password);

        if (passwordInDB === false) {
            return res.status(400).json({password: "Password is incorrect!"})
        }

        const cookie = jwt.sign({
            id: User._id
        }, process.env.SECRET);

        res.cookie('userToken', cookie, {
            httpOnly: true
        }).json({msg: "success", user: User, token: cookie});
        
    },

    getLogged:  (req, res) => {
        const id = jwt.decode(req.cookies.userToken); 
        user.findById({_id: id.id})
            .then((found)=> res.json(found))
            .catch((error) => res.status(400).json({ error: error, errors: 'failed to get logged in user' }) )
    },

    getLogout: (req, res) => {
        res.clearCookie('userToken');
        res.status(200).json({message: "logged out!"})
    }

};