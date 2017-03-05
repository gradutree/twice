var request = require('request');
var cheerio = require('cheerio');

var url = "http://www.utsc.utoronto.ca/~registrar/calendars/calendar/Computer_Science.html";

var tree = [];

request(url, function (err, res, html) {
    if (err) {
        console.log(err);
        return;
    }
    var $ = cheerio.load(html);
    var ref = 0;
    var miss = 0;

    $("span[class='strong']").filter(function () {
       var data = $(this);
       ref++;
       var pattern = /[A-Z][A-Z][A-Z][A-D][0-9][0-9]H[0-9]/;
       if (pattern.test(data.text())) {
           miss++;
           console.log("Course: "+data.text().trim());
       } else return;

        var node = data.next()[0].next;

        console.log("Prerequisites: ");
       while (node.name !== "br") {

            if (node.name === "a") {
                console.log(node.children[0].data);
            }
            node = node.next;
            if (!node) {
                return;
            }
       }
       console.log("-----");
    });
});

var addToTree = function (data) {
    // if does not have prereq add to list
    // else add to postreq of courses
};

var Class = function (data) {
    this.courseCode = data.code;
    this.prereq = [];
    this.postreq = null;
};