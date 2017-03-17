var crypto = require("crypto");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressValidator = require('express-validator');
var path = require("path");
var backend = require("./backend");

var dbURL = "mongodb://35.167.141.109:8000/c09";
var cobaltURL = "mongodb://35.167.141.109:8000/cobalt";
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

var sessionRedirect = function(req, res, next) {
    if (!req.session.user && req.originalUrl !== "/favicon.ico") {
        console.log(req.originalUrl);
        req.session.redirectTo = req.originalUrl;
        return res.redirect("/login");
    }
    return next();
};

app.get("/dashboard", function(req, res, next) {
    if (!req.session.user) return res.redirect("/login");
    return next();
});

app.get("/course/:code", function (req, res) {
    MongoClient.connect(dbURL, function (err, db) {
        db.collection("courses").findOne({code: req.params.code.toUpperCase()}, function (err, data) {
            if (data) {
                return res.sendFile(path.resolve("frontend/views/course.html"));
            }
            return res.status(404).end("No such course");
        });
    });

});

app.get("/trees", sessionRedirect, function(req, res) {
    if (!req.session.user) return res.redirect("/login");
    return res.sendFile(path.resolve("frontend/static/dashboard/index.html"));
});

app.get("/search", sessionRedirect, function(req, res) {
    if (!req.session.user) return res.redirect("/login");
    return res.sendFile(path.resolve("frontend/static/dashboard/index.html"));
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

// Enter query as a parameter. Allows for partial strings.
// Ex. curl http://localhost:8000/api/courses/query?code=CSCC09H3
// Response is an array of Course objects
app.get('/api/courses/query/', function (req, res) {
    var result = [];
    MongoClient.connect(cobaltURL, function (err, db) {
        db.collection("courses").find({code: {$regex : ".*"+req.query.code.toUpperCase()+".*"}}).toArray(function (err, data) {
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
            info.taken = data.taken;
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

app.get("/api/path/:start/post", function (req, res) {
    MongoClient.connect(dbURL, function (err, db) {
        courses = {};
        backend.visualizePostreq(db, req.params.start.toUpperCase(), courses).then(function () {
            res.json(courses);
        });
    });
});

app.get("/api/path/:start/pre", function (req, res) {
    MongoClient.connect(dbURL, function (err, db) {
        courses = {};
        backend.visualizePreq(db, req.params.start.toUpperCase(), courses).then(function () {
            res.json(courses);
        });
    });
});

app.post("/api/course/:code/vote/:action", function (req, res) {
    MongoClient.connect(dbURL, function (err, db) {
        db.collection("social").findOne({ code: req.params.code }, function (err, course) {
            switch(req.params.action) {
                case ("up"):
                    if (course.liked.contains(req.session.user.username))
                        db.collection("social").updateOne({code: req.params.code}, {$pop: {liked: req.session.user.username}});
                    else
                        db.collection("social").updateOne({code: req.params.code}, {$push: {liked: req.session.user.username}});
                    break;
                case ("down"):
                    if (course.disliked.contains(req.session.user.username))
                        db.collection("social").updateOne({code: req.params.code}, {$pop: {disliked: req.session.user.username}});
                    else
                        db.collection("social").updateOne({code: req.params.code}, {$push: {disliked: req.session.user.username}});
                    break;
                default:
                    return res.status(400).end("Invalid api action");
                    break;
            }
            res.end("success");
        });


    });
});

app.post("/api/review", function (req, res) {
    MongoClient.connect(dbURL, function (err, db) {
        var review = {};
        review.author = req.sessions.user.username;
        review.content = req.body.content;
        review.timestamp = new Date();
        review.up = [];
        review.down = [];
        review.courseCode = req.body.code;
        db.collection("reviews").insertOne(comment, function (err, item) {
            res.json({id: item._id});
        });
    });
});

app.get("/api/course/:code/review/:page", function (req, res) {
    var page = parseInt(req.params.page)*10;
    MongoClient.connect(dbURL, function (err, db) {
       db.collection("reviews").find({courseCode: req.params.code}, {skip: page, sort: [["timestamp", "desc"]], limit: 10}).toArray(function (err, data) {
           data.forEach(function (item, i) {
               item.up = item.up.length;
               item.down = item.down.length;
           });
           res.json(data);
       });
    });
});

app.post("/api/review/:id/vote/:action", function (req, res) {
    MongoClient.connect(dbURL, function (err, db) {
        db.collection("review").findOne({ code: req.params.id }, function (err, review) {
            switch(req.params.action) {
                case ("up"):
                    if (review.liked.contains(req.session.user.username))
                        db.collection("reviews").updateOne({code: req.params.id}, {$pop: {up: req.session.user.username}});
                    else
                        db.collection("reviews").updateOne({code: req.params.id}, {$push: {up: req.session.user.username}});
                    break;
                case ("down"):
                    if (review.disliked.contains(req.session.user.username))
                        db.collection("reviews").updateOne({code: req.params.id}, {$pop: {down: req.session.user.username}});
                    else
                        db.collection("reviews").updateOne({code: req.params.id}, {$push: {down: req.session.user.username}});
                    break;
                default:
                    return res.status(400).end("Invalid api action");
                    break;
            }
            res.end("success");
        });


    });
});

app.listen(8000, function () {
    console.log('App listening on port 8000');
});

