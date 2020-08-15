const router = require("express").Router();
const Product = require('../models/ProductModel');
const User = require('../models/UserModels');

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
        if (price >= 0) return res.status(400).json({ msg: "Can't insert that price" })

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

// edit products
router.post("/edit/:productId/:sellerId", async (req, res) => {
    try {
        const { productId, sellerId, tradeId } = req.params
        const { title, description, price, imgLink } = req.body;

        // validation
        if (!title || !description || !price || !imgLink) return res.status(400).json({ msg: "Not all field has been entered" });
        if (price <= 0) return res.status(400).json({ msg: "Can't insert that price" });

        const product = await Product.findById(productId);

        if (sellerId !== product.sellerId) return res.status(400).json({ msg: "You can't edit other people product"  })

        const userId = product.ordered.map(m => m.buyerId);
        const userArray = [];

        // cant use forEach because async await rules
        for (let i = 0; i < userId.length; i++) {
            const tempUser = await User.findById(userId[i]);
            userArray.unshift(tempUser);
        }

        const userCarts = userArray.map(m => m.carts);
        const user = userCarts[0].filter(m => m.id != productId);
        
        // change the data and save
        product.title = title;
        product.description = description;
        product.price = parseInt(price);
        product.imgLink = imgLink;
        await product.save();

        for (let i = 0; i < userId.length; i++) {
            const savedUser = await User.findById(userId[i]);
            const remainingCarts = savedUser.carts.filter(m => m.id != productId);
            savedUser.carts = remainingCarts;
            savedUser.markModified("carts");
            await savedUser.save();
        }

        res.json({
            user,
            product
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;