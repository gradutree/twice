var crypto = require("crypto");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressValidator = require('express-validator');
var path = require("path");
var backend = require("./backend");

var dbURL = "mongodb://35.167.141.109:8000/c09v2";
var cobaltURL = "mongodb://35.167.141.109:8000/cobalt";
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require("mongodb").ObjectID;

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
    this.taken = user.taken;
    this.allCourses = user.allCourses;
    this.profileImage = "/media/user.png";
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
        req.session.redirectTo = req.originalUrl;
        return res.redirect("/login");
    }
    return next();
};

app.get("/dashboard", sessionRedirect, function(req, res, next) {
    if (!req.session.user) return res.redirect("/login");
    return next();
});

app.get("/course/:code", function (req, res) {
    MongoClient.connect(dbURL, function (err, db) {
        db.collection("courses").findOne({code: req.params.code.toUpperCase()}, function (err, data) {
            if (data) {
                req.session.redirectTo = req.originalUrl;
                return res.sendFile(path.resolve("frontend/views/course.html"));
            }
            return res.redirect("/404");
        });
    });
});

app.get("/trees", sessionRedirect, function(req, res) {
    return res.sendFile(path.resolve("frontend/static/dashboard/index.html"));
});

app.get("/search", function(req, res) {
    return res.sendFile(path.resolve("frontend/static/index.html"));
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

app.use(function (req, res, next) {
    if (!req.session.user) res.cookie('username', "", { expires: new Date() });
    return next();
});

// API

// Enter query as a parameter. Allows for partial strings.
// Ex. curl http://localhost:8000/api/courses/query?code=CSCC09H3
// Response is an array of Course objects
app.get('/api/courses/query/', function (req, res) {
    var result = [];
    MongoClient.connect(dbURL, function (err, db) {
        db.collection("courses").find({code: {$regex : ".*"+req.query.code.toUpperCase()+".*"}}).toArray(function (err, data) {
            if (err) return res.status(500).end("Server error, could not resolve request");

            Promise.all(data.map(function (course) {
                return new Promise(function (resolve, reject) {
                    if (req.session.user) {
                        course.user_state = course.liked.indexOf(req.session.user.username) != -1 ? "1" : "0";
                        if (course.user_state == "0") course.user_state = course.disliked.indexOf(req.session.user.username) != -1 ? "-1" : "0";
                    }
                    course.liked = course.liked.length;
                    course.disliked = course.disliked.length;
                    db.collection("users").count({taken : { $in: [course.code]}}, function (err, taken) {
                        if (err) return res.status(500).end("Server error, could not resolve request");
                        course.takenCount = taken;
                        db.collection("users").findOne({taken: { $in: [course.code]}, username: ((req.session.user) ? req.session.user.username : "")}, function (err, hasTaken) {
                            if (err) return res.status(500).end("Server error, could not resolve request");
                            course.hasTaken = hasTaken != null;
                            db.collection("reviews").count({courseCode: course.code}, function (err, count) {
                                if (err) return res.status(500).end("Server error, could not resolve request");
                                course.commentCount = count;
                                if (req.session.user) {
                                    db.collection("reviews").findOne({courseCode: course.code, author: req.session.user.username}, function (err, data) {
                                        if (data) course.hasReviewed = true;
                                        result.push(course);
                                        resolve();
                                    });
                                } else {
                                    result.push(course);
                                    resolve();
                                }
                            });
                        });

                    });


                })
            })).then(function(){
                res.json(result);
            });
        });
    });
});

app.get("/api/courses/:code/recommend", function (req, res) {
    req.checkParams("code", "Course code must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            backend.findRecommended(db, req.params.code.toUpperCase(), function (data) {
                return res.json(data);
            });
        });
    });
});

// Returns the program requirements give the program name (:name) with query params "post" and "spec"
// Ex. curl http://localhost:8000/api/programs/ComputerScience?post=specialist&spec=SoftwareEngineering
app.get('/api/programs/:name', function (req, res) {
    req.checkParams("name", "Program name must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            db.collection("programs").findOne({name: req.params.name}, function (err, program) {
                if (err) {
                    console.log("GET program error");
                    res.json([]);
                    return;
                }

                // Trying to find specific specialization.
                if (req.query.spec != null && req.query.post == "specialist") {
                    res.json(program[req.query.post].find(spec => spec.stream == req.query.spec).reqs);
                    return;
                }
                res.json(program[req.query.post]);
                return;
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
                db.collection("users").insertOne(user, function (err2, newUser) {
                    res.json({id: newUser._id});
                });
            });
        });
    });
});

app.get('/api/signout/', function (req, res) {
    req.session.destroy(function(err) {
        if (err) return res.status(500).end(err);
        res.cookie('username', "", { expires: new Date() });

        return res.redirect("/");

    });
});

app.get("/api/path/:start/post", function (req, res) {

    req.checkParams("start", "Start course must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            if (err) return res.status(500).end("Server error, could not resolve request");
            var courses = {};
            backend.visualizePostreq(db, req.params.start.toUpperCase(), courses).then(function () {
                res.json(courses);
            });
        });
    });
});

app.get("/api/path/:start/pre", function (req, res) {

    req.checkParams("start", "Start course must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            var courses = {};
            backend.visualizePreq(db, req.params.start.toUpperCase(), courses).then(function () {
                res.json(courses);
            });
        });
    });
});

app.get("/api/course/:code/review/:page", function (req, res) {

    req.checkParams("code", "Start course must be alphanumeric").notEmpty().isAlphanumeric();
    req.checkParams("page", "Page must be a valid integer >= 0").notEmpty().isInt();

    var page = parseInt(req.params.page)*10;
    if (page < 0) return res.status(400).end("Page must be valid integer >= 0");

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            db.collection("reviews").find({courseCode: req.params.code.toUpperCase()}, {
                skip: page,
                sort: [["timestamp", "desc"]],
                limit: 10
            }).toArray(function (err, data) {
                data.forEach(function (item, i) {
                    if (req.session.user) {
                        item.user_state = item.up.indexOf(req.session.user.username) != -1 ? "1" : "0";
                        if (item.user_state == "0") item.user_state = item.down.indexOf(req.session.user.username) != -1 ? "-1" : "0";
                    }
                    item.up = item.up.length;
                    item.down = item.down.length;
                });
                db.collection("reviews").count({courseCode: req.params.code.toUpperCase()}, function (err, count) {
                    res.json({data: data, page: page / 10, more: count > page + 10});
                });

            });
        });
    });
});

app.get("/api/user/:username/info", function (req, res) {
    if (!req.session.user) return res.status(401).end("Access denied");
    if (req.params.username != req.session.user.username) return res.status(403).end("Access forbidden");

    req.checkParams("username", "Username must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            if (err) return res.status(500).end("Server error, could not resolve request");
            db.collection("users").findOne({username: req.params.username}, function (err, data) {
                if (err) return res.status(500).end("Server error, could not resolve request");
                var info = {};
                info.username = data.username;
                info.program = data.program;
                info.spec = data.spec;
                info.taken = data.taken;
                info.allCourses = data.allCourses;
                res.json(info);
            });
        });
    });
});

app.get("*", function(req, res) {
	res.redirect("/404");
});

app.use(function(req, res, next) {
    if (!req.session.user) return res.status(401).end("Access denied");
    return next();
});

app.post("/api/course/:code/vote/:direction", function (req, res) {

    req.checkParams("code", "Code must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        req.params.code = req.params.code.toUpperCase();
        MongoClient.connect(dbURL, function (err, db) {
            if (err) return res.status(500).end("Server error, could not resolve request");
            db.collection("courses").findOne({code: req.params.code}, function (err, course) {
                switch (req.params.direction) {
                    case ("1"):
                        db.collection("courses").updateOne({code: req.params.code}, {
                            $addToSet: {liked: req.session.user.username},
                            $pop: {disliked: req.session.user.username}
                        }, function (err, result) {
                            res.json({});
                        });
                        break;
                    case ("-1"):
                        db.collection("courses").updateOne({code: req.params.code}, {
                            $addToSet: {disliked: req.session.user.username},
                            $pop: {liked: req.session.user.username}
                        }, function (err, result) {
                            res.json({});
                        });
                        break;
                    case ("0"):
                        db.collection("courses").updateOne({code: req.params.code}, {
                            $pop: {
                                disliked: req.session.user.username,
                                liked: req.session.username
                            }
                        }, function (err, result) {
                            res.json({});
                        });
                        break;
                    default:
                        return res.status(400).end("Invalid api direction");
                        break;
                }
            });
        });
    });
});

app.post("/api/review", function (req, res) {

    req.checkBody("content", "Enter your message").notEmpty().isAscii();
    req.sanitizeBody("content").escape();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            if (err) return res.status(500).end("Server error, could not resolve request");
            var review = {};
            review.author = req.session.user.username;
            review.content = req.body.content;
            review.timestamp = new Date();
            review.up = [];
            review.down = [];
            review.courseCode = req.body.code.toUpperCase();
            db.collection("reviews").findOne({
                author: req.session.user.username,
                courseCode: review.courseCode
            }, function (err, data) {
                if (err) return res.status(500).end("Server error, could not resolve request");
                if (data) return res.status(409).end("User already submitted a review for this course");
                db.collection("reviews").insertOne(review, function (err, item) {
                    res.json({id: item._id});
                });
            });

        });
    });
});



app.post("/api/review/:id/vote/:direction", function (req, res) {

    req.checkParams("id", "Id must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            if (err) return res.status(500).end("Server error, could not resolve request");
            db.collection("reviews").findOne({_id: new ObjectID(req.params.id)}, function (err, review) {

                if (err) return res.status(500).end("Server error, could not resolve request");
                if (!review) return res.status(404).end("Cannot find review");
                switch (req.params.direction) {
                    case ("1"):
                        db.collection("reviews").updateOne({_id: new ObjectID(req.params.id)}, {
                            $addToSet: {up: req.session.user.username},
                            $pop: {down: req.session.user.username}
                        }, function (err, item) {
                            res.json({});
                        });
                        break;
                    case ("-1"):
                        db.collection("reviews").updateOne({_id: new ObjectID(req.params.id)}, {
                            $addToSet: {down: req.session.user.username},
                            $pop: {up: req.session.user.username}
                        }, function (err, item) {

                            res.json({});
                        });
                        break;

                    case ("0"):
                        db.collection("reviews").updateOne({_id: new ObjectID(req.params.id)}, {
                            $pop: {
                                down: req.session.user.username,
                                up: req.session.user.username
                            }
                        }, function (err, result) {
                            res.json({});
                        });
                        break;
                    default:
                        return res.status(400).end("Invalid api action");
                        break;
                }

            });


        });
    });
});

// Update user's list of taken courses with new course
app.patch('/api/users/:username/taken/:course', function (req, res, next){

    req.checkParams("username", "Username must be alphanumeric").notEmpty().isAlphanumeric();
    req.checkParams("course", "Course must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            db.collection("users").updateOne({username: req.params.username},
                {$addToSet: {taken: req.params.course, allCourses: req.params.course}}, function (err, result) {
                    res.json({});
                });
        });
    });
});

// Update user's list of taken courses by removing a course
app.delete('/api/users/:username/taken/:course', function (req, res, next){

    req.checkParams("username", "Username must be alphanumeric").notEmpty().isAlphanumeric();
    req.checkParams("course", "Course must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            db.collection("users").update({username: req.params.username},
                {$pull: {taken: req.params.course, allCourses: req.params.course}}, function (err, result) {
                    res.end();
                });
        });
    });
});

app.patch('/api/users/:username/allCourses/:course', function (req, res, next){
    req.checkParams("username", "Username must be alphanumeric").notEmpty().isAlphanumeric();
    req.checkParams("course", "Course must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            db.collection("users").updateOne({username: req.params.username},
                {$addToSet: {allCourses: req.params.course}}, function (err, result) {
                    res.json({});
                });
        });
    });
});

// Update user's list of taken courses by removing a course
app.delete('/api/users/:username/allCourses/:course', function (req, res, next){
    req.checkParams("username", "Username must be alphanumeric").notEmpty().isAlphanumeric();
    req.checkParams("course", "Course must be alphanumeric").notEmpty().isAlphanumeric();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
            return res.status(400).end(result.array()[0].msg);
        }
        MongoClient.connect(dbURL, function (err, db) {
            db.collection("users").update({username: req.params.username},
                {$pull: {allCourses: req.params.course}}, function (err, result) {
                    res.end();
                });
        });
    });
});



app.listen(8000, function () {
    console.log('App listening on port 8000');
});