const mongoose = require("mongoose")

const sportSchema = new mongoose.Schema({
    
    fullName: {
        type: String, required: [true, 'Full name is required.'],
        minlength: [5, 'Full name must be atleast 5 characters.']
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Please enter a valid email"
        }
    },

    password: {
        type: String, required: [true, 'Password is required.'],
        minlength: [5, 'Password must be at least 5 characters.']
    },

    bio: {
        type: String, required: [true, 'Bio is required.'],
        minlength: [5, 'Bio must be at least 5 characters.']
    },

    city: {
        type: String, required: [true, 'Current city is required.'],
        minlength: [3, 'City must be at least 3 characters.']
    },

    state: {
        type: String, required: [true, 'Current state is required.'],
        minlength: [3, 'State must be at least 3 characters.']
    },
    sport: {
        type: String, required: [true, 'Favorite Sport is required.'],
        minlength: [3, 'Sport must be at least 3 characters.']
    },

    sportTeam: {
        type: String, required: [true, 'Favorite sport team is required.'],
        minlength: [3, 'Sport team must be at least 3 characters.']
    },

    birthDate: {
        type: String, required: [true, 'Please add your birthday.']
    },

    gender: {
        type: String, required: [true, 'Please select your gender.']
    },

    photo: {
        type: String, required: [true, 'Please provide a profile picture.']
    },

}, { timestamps: true });

sportSchema.virtual('confirmPassword')
    .get(() => this.confirmPassword)
    .set(value => this.confirmPassword = value);

sportSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});

const bcrypt = require('bcrypt');

sportSchema.pre('save', function(next) {
    if(this.isNew) {
        bcrypt.hash(this.password, 10)
            .then(hash => {
                this.password = hash;
                next();
            });
    } else {
        next();
    }
});

const User = mongoose.model('User', sportSchema)

module.exports = User;
