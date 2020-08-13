const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// set up express
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));




console.log(NODE_ENV);

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
    const route = require("./routes/user");
    app.use("/user", route);

app.listen(PORT, console.log(`${PORT} Success`));