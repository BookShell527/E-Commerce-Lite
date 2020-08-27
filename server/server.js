const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// set up express
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));

// set up mongoose
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(
    MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    err => {
        if (err) throw err;
        console.log("Mongo Success");
    }
    );
    
    // set routes
    const userRoute = require("./routes/user");
    const productRoute = require("./routes/product");
    app.use("/user", userRoute);
    app.use("/product", productRoute);

app.listen(PORT, console.log(`${PORT} Success`));