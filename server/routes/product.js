const router = require("express").Router();
const Product = require('../models/ProductModel');

// find all product
router.get("/", async (req, res) => {
    try {
        const product = await Product.find();
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// find product by id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// sell products
router.post("/sell/:sellerId", async (req, res) => {
    try {
        const { sellerId } = req.params
        const { title, description, price, imgLink } = req.body;

        if (!title || !description || !price || !imgLink) return res.status(400).json({ msg: "Not all field has been entered" });

        const newProduct = new Product({
            sellerId,
            title,
            description,
            price,
            imgLink,
        });

        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;