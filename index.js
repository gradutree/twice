var crypto = require("crypto");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressValidator = require('express-validator');
var path = require("path");

var dbURL = "mongodb://localhost:27017/c09";
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
    this.spec = user.spec;
    this.salt = salt;
    this.saltedHash = hash.digest('base64');
};

var checkPassword = function(user, password){
    var hash = crypto.createHmac('sha512', user.salt);
    hash.update(password);
    var value = hash.digest('base64');
    return (user.saltedHash === value);
};

app.get("/dashboard", function(req, res, next) {
    if (!req.session.user) return res.redirect("/login");
    return next();
});

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

// Enter query as a parameter 
// Ex. curl http://localhost:8000/api/courses/query?code=CSCC09H3
// Response is an array of Course objects
app.get('/api/courses/query/', function (req, res) {
    // console.log(req.query);
    var result = [];
    MongoClient.connect(dbURL, function (err, db) {
        db.collection("courses").find(req.query).toArray(function (err, data) {
            if (err) {
                res.json([]);
                return;
            }

            Promise.all(data.map(function (course) {
                result.push(course);
            })).then(function(){
                res.json(result);
            });
        });
    });
});

app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, 'frontend/static', 'index.html'))
});


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


app.get("/api/user/:username/info", function (req, res) {
    MongoClient.connect(dbURL, function (err, db) {
        db.collection("users").findOne({username: req.params.username}, function (err, data) {
            if (err) return res.status(500).end("Server error, could not resolve request");
            var info = {};
            info.username = data.username;
            info.program = data.program;
            info.spec = data.spec;
            res.json(info);
        });
    });
});

app.get('/api/signout/', function (req, res) {
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
        return res.redirect("/");
    });
});

app.listen(8000, function () {
    console.log('App listening on port 8000');
});

