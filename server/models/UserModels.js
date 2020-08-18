const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    gooId: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
    },
    displayName: {
        type: String,
        required: true,
    },
    carts: {
        type: Array,
        required: false,
        default: []
    }
});

module.exports = User = mongoose.model("users", UserSchema);