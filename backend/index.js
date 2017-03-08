var dbURL = "mongodb://localhost:27017/c09";
var MongoClient = require('mongodb').MongoClient;
var start = "CSCC09H3";

var visualizeNodes = function (db, courseCode, node) {
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
                    visualizeNodes(db, item[0], node.preq[i]).then(function () {
                        count--;
                        if (count == 0) deferred.resolve();
                    });
                });
            }

        } else deferred.resolve();

    });

    return deferred.promise;
};

MongoClient.connect(dbURL, function (err, db) {
    var courses = {};
    visualizeNodes(db, start, courses).then(function () {
        console.log(JSON.stringify(courses));
        db.close();
    });

});