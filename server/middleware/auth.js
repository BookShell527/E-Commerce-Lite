const jwt = require('jsonwebtoken');
const User = require('../models/UserModels');

const auth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        const id = req.header("id");
        const isGoogle = await User.findById(id);

        if (isGoogle.gooId) {
            req.user = id;
            return next();
        }

        if (!token) return res.status(401).json({ msg: "No authentication token, access denied" });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.status(401).json({ msg: "Token verification failed, access denied" });

        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = auth;