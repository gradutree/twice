var dbURL = "mongodb://localhost:27017/c09";
var MongoClient = require('mongodb').MongoClient;
var start = "CSCA08H3";

var visualizePreq = function (db, courseCode, node) {
    // this function will render a tree like graph in json
    // with a starting node using course data
    // structure : {data: {courseid: "", title: "", next: [ {courseid: "", title: "", next: []}, ... ]}

    // for now it will only work backwards, but il make one from a root soon

    var deferred = Promise.defer();

    db.collection("courses").findOne({ code: courseCode }, function (err, data) {

        if (data) {
            node.title = data.title;
            node.courseid = courseCode;
            node.preq = [];
            if (data.preq.length === 0) {
                deferred.resolve();
            } else {
                var count = data.preq.length;
                data.preq.forEach(function (item, i) {

                    node.preq.push({});
                    visualizePreq(db, item[0], node.preq[i]).then(function () {
                        count--;
                        if (count == 0) deferred.resolve();
                    });
                });
            }

        } else deferred.resolve();

    });

    return deferred.promise;
};

var buildPreq = function () {
    MongoClient.connect(dbURL, function (err, db) {
        var courses = {};
        visualizePreq(db, start, courses).then(function () {
            console.log(JSON.stringify(courses));
            db.close();
        });

    });
};

var visualizePostreq = function (db, courseCode, node) {
    // this function will render a tree like graph in json
    // with a starting node using course data
    // structure : {data: {courseid: "", title: "", next: [ {courseid: "", title: "", next: []}, ... ]}

    // for now it will only work backwards, but il make one from a root soon

    var deferred = Promise.defer();

    db.collection("courses").findOne({ code: courseCode }, function (err, data) {

        if (data) {

            node.title = data.title;
            node.courseid = courseCode;
            node.postreq = [];

            if (!data.postreq) deferred.resolve();
            else if (data.postreq.length === 0) {
                deferred.resolve();
            } else {
                var count = data.postreq.length;
                data.postreq.forEach(function (item, i) {

                    node.postreq.push({});

                    visualizePostreq(db, item, node.postreq[i]).then(function () {
                        count--;
                        if (count == 0) deferred.resolve();
                    });
                });
            }

        } else deferred.resolve();

    });

    return deferred.promise;
};

var buildPostreq = function () {
    MongoClient.connect(dbURL, function (err, db) {
        var courses = {};
        visualizePostreq(db, start, courses).then(function () {
            console.log(JSON.stringify(courses));
            db.close();
        });

    });
};

var findPostReq = function (db, callback) {

    db.collection("courses").find({}).toArray(function (err, data) {
        if (!data) callback();

        var count = data.length;
        console.log(count);
        if (count == 0) callback();

        data.forEach(function (item, i) {

            db.collection("courses").find({ preq : { $in: [[item.code]] }}).toArray(function (err, courses) {
                if (err) {
                    console.log(err);
                    count--;
                    return;
                }
                if (!item.postreq) {
                    item.postreq = [];
                }
                var count2 = courses.length;
                if (courses.length == 0) count--;
                if (count == 0) callback();
                for (var i = 0; i < courses.length; i++) {
                    item.postreq.push(courses[i].code);
                    console.log(item.postreq.toString());
                    db.collection("courses").updateOne({ code: item.code }, item, function (err, num) {
                        count2--;
                        if (count2 == 0) count--;
                        if (count == 0) callback();
                    });
                }
            });
        });
    });
};

var setPostReq = function () {
    MongoClient.connect(dbURL, function (err, db) {

        findPostReq(db, function () {
            console.log("Done setting preqs for all courses");
            db.close();
        });

    });
};

buildPostreq();