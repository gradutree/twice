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

backend.findRecommended = function (db, courseCode, callback) {
    db.collection("users").find({ taken: { $in: [courseCode]}}).toArray(function (err, data) {
       var count = data.length;
       var courseCount = {};
       data.forEach(function (item) {
           item.taken.forEach(function (course) {
               if (course == courseCode) return;
               if (Object.keys(courseCount).indexOf(course) == -1) {
                   courseCount[course] = 1;
               } else {
                   courseCount[course]++;
               }
           });

       });

       var sorted = {};
       var i = 0;
       Object.keys(courseCount).sort(function (a, b) {
           return courseCount[b] - courseCount[a];
       }).forEach(function (item) {
           if (i == 5) {
                return;
           }
           sorted[item] = courseCount[item]/count*100;
           i++;

       });



       callback(sorted);
    });
};

var testRecommend = function () {
    MongoClient.connect(dbURL, function (err, db) {
        backend.findRecommended(db, "CSCA08H3", function (data) {
            Object.keys(data).forEach(function (item) {
                console.log(item+" is taken by "+(data[item])+"% of people who have taken CSCA08H3");
            });
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
