var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;

var url = "http://www.utsc.utoronto.ca/~registrar/calendars/calendar/Computer_Science.html";
var dbURL = "mongodb://localhost:27017/";

var addCourses = function(dbName) {

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
            var elems = $("span[class='strong']");
            var count = elems.length;
            elems.each(function (i, item) {
                var data = $(this);
                ref++;
                var pattern = /[A-Z][A-Z][A-Z][A-D][0-9][0-9]H[0-9]/;
                var course;
                if (pattern.test(data.text())) {
                    hit++;
                    // console.log("Adding course: "+data.text().trim());
                    // magic string "    "
                    course = new Class(data.text().trim().split("    ")[0], data.text().trim().split("    ")[1]);
                } else return;

                var node = data.next()[0].next;

                // console.log("Prerequisites: ");
                var or = false;
                while (node.name !== "br") {

                    if (node.data == " or ") {
                        or = true;
                        if (course.preq.length != 0) course.preq[course.preq.length - 1].or = true;
                    }
                    else if (node.name === "a") {

                        course.preq.push({course: node.children[0].data, or: or});
                        or = false;
                    }
                    node = node.next;

                    if (!node) {
                        break;
                    }
                }
                db.collection("courses").insertOne(course, function (err, r) {
                    if (err) {
                        console.log("Failed to insert document: " + data.text().trim());
                        return;
                    }
                    console.log("Added course: " + data.text().trim());
                });
                // console.log("-----");
                if (count == i + 1) {
                    db.close();
                }
            });

        });
    });
};

var Class = function (code, title) {
    this.code = code;
    this.title = title;
    this.preq = [];
};

if (process.argv.length == 2) {
    console.log("Usage: index.js [Database Name]");
} else {
    addCourses(process.argv[2]);
}
