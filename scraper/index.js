var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;

var url = "http://www.utsc.utoronto.ca/~registrar/calendars/calendar/Computer_Science.html";
var dbURL = "mongodb://35.167.141.109:8000/";

var addCourses = function(dbName, callback) {

    dbURL += dbName;

    MongoClient.connect(dbURL, function (err, db) {
        if (err) {
            console.log(err);
            return;
        }

        console.log("Connected to db.");

        request(url, function (err, res, html) {
            if (err) {
                console.log(err);
                return;
            }
            var $ = cheerio.load(html);
            var ref = 0;
            var hit = 0;
            var elems = $("span[class='strong']").toArray();
            var count = elems.length;
            Promise.all(elems.map(function (item) {
                return new Promise(function (resolve, reject) {
                    var data = $(item);

                    ref++;
                    var pattern = /[A-Z][A-Z][A-Z][A-D][0-9][0-9]H[0-9]/;
                    var course;
                    if (pattern.test(data.text())) {
                        hit++;
                        // console.log("Adding course: "+data.text().trim());
                        // magic string "    "
                        course = new Course(data.text().trim().split("    ")[0], data.text().trim().split("    ")[1]);
                    } else resolve();

                    course.description = data.next().text();
                    var node = data.next()[0].next;


                    // console.log("Prerequisites: ");

                    while (node.name !== "br") {


                        if (node.name === "a" && node.data !== " or ") {
                            var preq = [];
                            preq.push(node.children[0].data);
                            while (node.next.data == " or ") {
                                preq.push(node.next.next.children[0].data);
                                node = node.next.next;
                            }
                            course.preq.push(preq);
                        }
                        node = node.next;

                        if (!node) {
                            break;
                        }

                    }
                    db.collection("courses").insertOne(course, function (err, r) {
                        if (err) {
                            reject("Failed to insert document: " + data.text().trim());
                            return;
                        }
                        resolve("Added course: " + data.text().trim());
                    });
                });
            })).then(function () {
                console.log("Total: "+hit+" courses added");
                console.log("Total: "+ref+" elements inspected");
                db.close();
            });



                // console.log("-----");
                //if (count == i + 1) {
                //
                //}


        });
    });
};

var Course = function (code, title) {
    this.code = code;
    this.title = title;
    this.preq = [];
    this.description = null;
};

if (process.argv.length != 3) {
    console.log("Usage: index.js [Database Name]");
} else {
    addCourses(process.argv[2]);
}
