var crypto = require("crypto");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressValidator = require('express-validator');
var path = require("path");

var dbURL = "mongodb://35.167.141.109:8000/c09";
var MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.json());
app.use(expressValidator());

var session = require('express-session');
app.use(session({
    secret: 'twice',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: true
    }
}));

var User = function(user){
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(user.password);
    this.username = user.username;
    this.program = user.program;
    this.salt = salt;
    this.saltedHash = hash.digest('base64');
};

var checkPassword = function(user, password){
    var hash = crypto.createHmac('sha512', user.salt);
    hash.update(password);
    var value = hash.digest('base64');
    return (user.saltedHash === value);
};

app.get("/", function(req, res, next) {
    if (req.session.user) return res.redirect("/dashboard");
    delete req.session.redirectTo;
    return next();
});

app.get("/login", function(req, res, next) {
    if (req.session.user) return res.redirect("/dashboard");
    return next();
});

app.get("/signup", function(req, res, next) {
    if (req.session.user) return res.redirect("/dashboard");
    return next();
});

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    return next();
});

app.use(express.static('frontend/static'));

// API

app.post('/api/login/', function (req, res) {
    req.checkBody("username", "Username must be alphanumeric").notEmpty().isAlphanumeric();
    req.checkBody("password", "Password must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            db.collection("users").findOne({username: req.body.username}, function (err, user) {
                if (err) return res.status(500).end("Server error, could not resolve request");
                if (!user || !checkPassword(user, req.body.password)) return res.status(403).end("Invalid username or password");
                req.session.user = user;
                console.log(req.session.user);
                res.cookie('username', user.username, {httpOnly: false});

                res.json({username: user.username, redirect: req.session.redirectTo});
                delete req.session.redirectTo;

            });
        });
    });
});

app.post("/api/user", function(req, res) {

    req.checkBody("username", "Username must be alphanumeric").notEmpty().isAlphanumeric();
    req.checkBody("password", "Password must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        var user = new User(req.body);
        MongoClient.connect(dbURL, function (err, db) {
            db.collection("users").findOne({username: req.body.username}, function (err, data) {
                if (err) return res.status(500).end("Server error, could not resolve request");
                if (data) {
                    return res.status(409).end("Username already exists");
                }
                db.collection("users").insert(user, function (err2, newUser) {
                    res.json({id: newUser._id});
                });
            });
        });
    });
});

app.listen(8000, function () {
    console.log('App listening on port 8000');
});

