const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const { UserModel, TodoModel } = require('./db');
const JWT_SECRET = "tanvi";
app.use(express.json());
mongoose.connect("mongodb+srv://rudrasalokhe05:ojsmuiC0bCDcQAFB@cluster0.eix9d.mongodb.net/TODO-APP-DATABASE")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));
app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email: email,
        password: password,
        name: name
    });

    res.json({
        message: "You are signed up"
    });
});

// Signin route
app.post('/signin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password: password
    });

    if (user) {
        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        });
    } else {
        res.json({
            message: "Invalid Username and Password"
        });
    }
});

// Todo route (placeholder)
app.post('/todo', async (req, res) => {
    res.json({
        message: "Todo route"
    });
});

// Todos route (placeholder)
app.post('/todos', async (req, res) => {
    res.json({
        message: "Todos route"
    });
});

// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3000");
});