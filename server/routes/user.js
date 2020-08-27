const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
const { v4 } = require('uuid');

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

// login with google
router.post("/loginGoogle", async (req, res) => {
    // get data
    const { email, gooId, displayName, carts } = req.body;

    // check if exist
    const isExist = await User.findOne({ gooId });
    if (isExist) {
        return res.json({
            user: {
                id: isExist._id,
                gooId: isExist.gooId,
                displayName: isExist.displayName,
                email: isExist.email
            }
        })
    }

    // if not, save user
    const newUser = new User({
        gooId,
        email,
        displayName,
        password: "aocbiqwvoqoiboebfosdibbwevbqohef982389gr0ehnfvjcbdsjvuisudvihwhe09fh093hu2uib4g",
        carts
    });
    const savedUser = await newUser.save();

    res.json(savedUser)
})

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
        const id = req.header("id");
        const isGoogle = await User.findById(id);

        if (isGoogle.gooId) {
            return res.json(true);
        }

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

        if (user.gooId) {
            return res.json({
                id: user._id,
                gooId: user.gooId,
                displayName: user.displayName,
                email: user.email,
                dark: user.dark,
                carts: user.carts
            })
        }

        res.json({
            id: user._id,
            displayName: user.displayName,
            email: user.email,
            dark: user.dark,
            carts: user.carts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// to find user with id
router.get('/findById/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = User.findById(id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// to add product to carts
router.post('/addProduct/:productId/:userId', async (req, res) => {
    try {
        // take data
        const { productId, userId } = req.params;
        const { productAmount } = req.body;
        const tradeId = v4();

        // find user & product
        const product = await Product.findById(productId);
        const selectedUser = await User.findById(userId);

        // validation
        if (product.sellerId === userId) return res.status(400).json({ msg: "You can't buy your own product" });
        if (!productAmount || productAmount === null || productAmount === undefined || isNaN(productAmount)) return res.status(400).json({ msg: "Not all field has been entered" });
        if (productAmount === 0) return res.json({ msg: "Can't insert amount = 0" });
        if (productAmount < 0) return res.json({ msg: "Can't insert amount = negative number" });


        // object to insert
        const updatedCarts = {
            tradeId,
            id: product._id,
            sellerId: product.sellerId,
            title: product.title,
            price: parseInt(product.price),
            imgLink: product.imgLink,
            productAmount: parseInt(productAmount)
        }

        const updatedOrdered = {
            tradeId,
            buyerId: selectedUser._id,
            buyer: selectedUser.displayName,
            buyerEmail: selectedUser.email,
            amount: parseInt(productAmount)
        }

        // enter the data
        product.ordered.unshift(updatedOrdered);
        await product.save();

        selectedUser.carts.unshift(updatedCarts);
        await selectedUser.save();

        res.json({
            selectedUser,
            product
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// edit carts
router.patch('/editProduct/:productId/:userId/:tradeId', async (req, res) => {
    try {
        const { productId, userId, tradeId } = req.params;
        const { productAmount } = req.body;

        // validation
        if (!productAmount || productAmount === null || productAmount === undefined || isNaN(productAmount)) return res.status(400).json({ msg: "Not all field has been entered" });
        if (productAmount === 0) return res.json({ msg: "Can't insert amount = 0" });
        if (productAmount < 0) return res.json({ msg: "Can't insert amount = negative number" });
    
        // selected data
        const product = await Product.findById(productId);
        const user = await User.findById(userId);
        
        // modifying and save
        const selectedOrder = product.ordered.filter(m => m.tradeId === tradeId);
        selectedOrder.map(m => m.amount = parseInt(productAmount));
        product.markModified("ordered");
        await product.save();
        
        const selectedCarts = user.carts.filter(m => m.tradeId === tradeId);
        selectedCarts.map(m => m.productAmount = parseInt(productAmount));
        user.markModified("carts");
        await user.save();

        // response
        res.json({
            selectedOrder,
            selectedCarts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// delete product from carts
router.delete('/deleteProduct/:productId/:userId/:tradeId', async (req, res) => {
    try {
        const { productId, userId, tradeId } = req.params;

        // selected data
        const product = await Product.findById(productId);
        const user = await User.findById(userId);

        // delete and save the data
        const remainingOrder = product.ordered.filter(m => m.tradeId !== tradeId);
        product.ordered = remainingOrder;
        product.markModified("ordered");
        await product.save();
        
        const remainingCarts = user.carts.filter(m => m.tradeId !== tradeId);
        user.carts = remainingCarts;
        user.markModified("carts");
        await user.save();

        res.json({
            remainingOrder,
            remainingCarts
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// save dark mode to the database
router.post("/darkmode/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { dark } = req.body;

        // select data
        const user = await User.findById(userId);

        user.dark = dark;
        await user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;