// V2 of scrapper will now obtain information from cobalt.qas.im
// rather than from utsc/uoft websites

//const DbURL = "mongodb://35.167.141.109:8000/cobalt";
const OutputURL = "mongodb://35.167.141.109:8000/c09v2";
const fs = require("fs");

var MongoClient = require('mongodb').MongoClient;

var setupPreqs = function () {
    fs.readFile("courses.json", "utf-8", function (err, data) {
        data = data.split("\n");

        var courses = [];
        var codes = [];

        Promise.all(data.map(function (item) {
            return new Promise(function (resolve, reject) {
                if (item != "") item = JSON.parse(item);
                else {resolve(); return;}
                if (item.campus != "UTSC") {
                    resolve();
                    return;
                }
                var course = {};

                course.code = item.code.substring(0, item.code.length-1);
                if (codes.includes(course.code)) {
                    resolve();
                    return;
                }
                codes.push(item.code.substring(0, item.code.length-1));
                course.prerequisites = item.prerequisites;
                course.name = item.name;
                course.level = item.level;
                course.description = item.description;
                course.department = item.department;
                course.liked = [];
                course.disliked = [];
                var delimiter = " & ";
                if (item.prerequisites.indexOf(" & ") == -1) delimiter = " and ";
                course.preq = [];
                item.prerequisites.replace(/[^0-9a-z /&]/gi, '').replace("one of ").split(delimiter).reduce(function(result, preq) {
                    var res = preq.replace("/", " or ").split(" or ");
                    var flag = true;
                    var pat = /[A-Z][A-Z][A-Z][1-4]|[A-D][0-9][0-9]H|Y/;
                    for (var i = 0; i < res.length; i++) {

                        if (res[i].length != 8) {
                            if (res[i].length != 7)
                                flag = false;
                            else if (pat.test(res[i])) {
                                console.log(res[i]);
                                res.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    if (flag) result.push(res);
                    return result;
                }, course.preq);



                courses.push(course);
                resolve();
            });
        })).then(function () {

            console.log(courses.length);
            MongoClient.connect(OutputURL, function (err, db2) {
                db2.collection("courses").insertMany(courses, function (err, num) {
                    console.log(num.insertedCount+" course preqs have been parsed and added to db.");
                    db2.close();
                });
            });

        });
    });
};

setupPreqs();