const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    sellerId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imgLink: {
        type: String,
        required: true
    },
    ordered: {
        type: Array,
        required: false,
        default: []
    }
})

module.exports = Product = mongoose.model("product", ProductSchema);