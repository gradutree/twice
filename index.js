var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressValidator = require('express-validator');

app.use(bodyParser.json());
//app.use(expressValidator());

var User = function(user){
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt);
    hash.update(user.pass);
    this.username = user.uname;
    this.salt = salt;
    this.saltedHash = hash.digest('base64');
};

var checkPassword = function(user, password){
    var hash = crypto.createHmac('sha512', user.salt);
    hash.update(password);
    var value = hash.digest('base64');
    return (user.saltedHash === value);
};

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    return next();
});

app.use(express.static('frontend/static'));

app.get("/test", function (req, res) {
   res.end("Yup its working");
});

app.listen(8000, function () {
    console.log('App listening on port 8000');
});

