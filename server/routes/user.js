const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')

// models
const User = require('../models/UserModels');
const Product = require('../models/ProductModel');

// for register
// return json object
router.post("/register", async (req, res) => {
    try {
        const { email, password, passwordCheck, displayName, carts } = req.body;
        
        // validation
        if (!email || !password || !passwordCheck || !displayName) return res.status(400).json({ msg: "Not all field has been entered" });
        if (password.length < 4) return res.status(400).json({ msg: "Password need to be atleast 4 character long" });
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        if (password !== passwordCheck) return res.status(400).json({ msg: "Enter the same password twice for verification" });
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "An account with this email already exist" });

        const newUser = new User({
            email,
            password: passwordHash,
            displayName,
            carts
        });

        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// for login
// return json object
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        if(!email || !password) return res.status(400).json({ msg: "Not all field has been entered" });
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "No account with this email has been registered" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email,
            }
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// deleting account
// not used yet
router.delete('/delete', auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// check if token is valid
// return boolean
router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// to get necessary data
// return json object
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        res.json({
            id: user._id,
            displayName: user.displayName,
            email: user.email,
            carts: user.carts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// to add product to carts
router.post('/addProduct/:productId/:userId', async (req, res) => {
    try {
        // take data
        const { productId, userId } = req.params;
        const { productAmount } = req.body;

        // find user & product
        const product = await Product.findById(productId);
        const selectedUser = await User.findById(userId);

        // validation
        if (product.sellerId === userId) return res.status(400).json({ msg: "You can't buy your own product" });

        // object to insert
        const updatedCarts = {
            id: product._id,
            sellerId: product.sellerId,
            title: product.title,
            price: product.price,
            imgLink: product.imgLink,
            productAmount: parseInt(productAmount)
        }

        const updatedOrdered = {
            buyerId: selectedUser._id,
            buyer: selectedUser.displayName,
            buyerEmail: selectedUser.email,
            amount: parseInt(productAmount)
        }

        // enter the data
        product.ordered.unshift(updatedOrdered);
        product.save();

        selectedUser.carts.unshift(updatedCarts);
        selectedUser.save();

        res.json({
            selectedUser,
            product
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;