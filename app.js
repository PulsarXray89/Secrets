//jshint esversion:6
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const md5 = require("md5")

const app = express()

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://127.0.0.1:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String
    , password: String
})

const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.render("home")
})

app.route("/login")
    .get((req, res) => {
        res.render("login")
    })
    .post(async (req, res) => {
        await User.findOne({ email: req.body.username }).then(user => {
            if (user.password === md5(req.body.password)) {
                res.render("secrets")
            } else {
                res.send("Wrong username or password.")
            }
        })
    })

app.route("/register")
    .get((req, res) => {
        res.render("register")
    })
    .post(async (req, res) => {
        const newUser = new User({
            email: req.body.username
            , password: md5(req.body.password)
        })

        await newUser.save().then(user => {
            if (user) {
                res.render("secrets")
            } else {
                console.log("Error creating user.")
            }
        })
    })

app.listen(3000, () => {
    console.log("Server started on port 3000.")
})