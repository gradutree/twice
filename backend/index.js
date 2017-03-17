var dbURL = "mongodb://35.167.141.109:8000/c09v2";
var MongoClient = require('mongodb').MongoClient;
var start = "CSCA08H3";

var backend = {};

backend.visualizePreq = function (db, courseCode, node) {
    // this function will render a tree like graph in json
    // with a starting node using course data
    // structure : {data: {courseid: "", title: "", next: [ {courseid: "", title: "", next: []}, ... ]}

    return new Promise(function(resolve, reject) {
      db.collection("courses").findOne({ code: courseCode }, {_id: 0}, function (err, data) {

          if (data) {
              node.title = data.title;
              node.courseid = courseCode;
              node.preq = [];
              if (data.preq.length === 0) {
                  resolve();
              } else {
                  var count = data.preq.length;
                  data.preq.forEach(function (item, i) {

                      node.preq.push({});
                      backend.visualizePreq(db, item[0], node.preq[i]).then(function () {
                          count--;
                          if (count == 0) resolve();
                      });
                  });
              }

          } else resolve();

      });
    });

};

buildPreq = function () {
    MongoClient.connect(dbURL, function (err, db) {
        var courses = {};
        backend.visualizePreq(db, start, courses).then(function () {
            console.log(JSON.stringify(courses));
            db.close();
        });

    });
};

backend.visualizePostreq = function (db, courseCode, node) {
    // this function will render a tree like graph in json
    // with a starting node using course data
    // structure : {data: {courseid: "", title: "", next: [ {courseid: "", title: "", next: []}, ... ]}


    return new Promise(function(resolve, reject) {
      db.collection("courses").findOne({ code: courseCode }, {_id: 0}, function (err, data) {

          if (data) {

              node.name = data.name;
              node.courseid = courseCode;
              node.postreq = [];

              if (!data.postreq) resolve();
              else if (data.postreq.length === 0) {
                  resolve();
              } else {
                  var count = data.postreq.length;
                  data.postreq.forEach(function (item, i) {

                      node.postreq.push({});

                      backend.visualizePostreq(db, item, node.postreq[i]).then(function () {
                          count--;
                          if (count == 0) resolve();
                      });
                  });
              }

          } else resolve();

      });
    });

};

var buildPostReq = function () {
    MongoClient.connect(dbURL, function (err, db) {
        var courses = {};
        backend.visualizePostreq(db, start, courses).then(function () {
            console.log(JSON.stringify(courses));
            db.close();
        });

    });
};

backend.findPostReq = function (db, callback) {

    db.collection("courses").find({}).toArray(function (err, data) {
        if (err) {
            callback();
            return;
        }

        Promise.all(data.map(function (item, i) {
            return new Promise(function (resolve, reject) {
                db.collection("courses").find({ preq : { $in: [[ item.code ]] }}).toArray(function (err, courses) {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    if (!item.postreq) {
                        item.postreq = [];
                    }

                    Promise.all(courses.map(function (course) {

                        return new Promise(function (resolve2, reject2) {
                            item.postreq.push(course.code);
                            //console.log(item.postreq.toString());
                            resolve2();
                        });
                    })).then(function () {
                        db.collection("courses").updateOne({ code: item.code }, item, function (err, num) {
                            console.log("Finished adding postreqs for "+item.code);
                            resolve();
                        });

                    });

                });
            });
        })).then(function () {

            callback();
        });
    });
};

var setPostReq = function () {
    MongoClient.connect(dbURL, function (err, db) {

        backend.findPostReq(db, function () {
            console.log("Done setting preqs for all courses");
            db.close();
        });

    });
};

// proper setup order:
// -create c09 database
// -use scraper to get course data
// -run setPostReq
// -then run the build functions
module.exports = backend;
buildPostReq();