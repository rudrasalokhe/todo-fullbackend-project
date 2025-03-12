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

    if(await UserModel.exists({email})){
        return res.json({
            message : "Email already exists"
        })
    }
    await UserModel.create({
        email: email,
        password: password,
        name: name
    });
    res.json({
        message: "You are signed up"
    });
});

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

app.post('/todo', auth, async (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;
    const todo = await TodoModel.create({
        userId, 
        title, 
        done
    });
    res.json({
        message : "Todo created sucessfully",
        todo
    })
});

function auth(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.json({
            message: "Token missing"
        });
    }
    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.userId = decodedData.id;
        next();
    } catch (err) {
        res.json({
            message: "Invalid Token"
        });
    }   
    console.log(token);
}

app.post('/todos', auth,  async (req, res) => {
    const userId = req.userId;
    const todos =  await TodoModel.find({
        userId
    })
    res.json({
        todos
    })
});

app.listen(3002, () => {
    console.log("Server is running on port 3002");
});