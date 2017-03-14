var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var dbURL = "mongodb://localhost:27017/";

var contents = fs.readFileSync('courses.json').toString();
var courseJSON = JSON.parse("[" + contents.split("\n").join(",") + "]");

// console.log(courseJSON[2]);
// // var jsonContent = JSON.parse(contents.split);
// // console.log(data);

MongoClient.connect(dbURL, function (err, db) {
    if (err) {
        console.log(err);
        return;
    }

    courseJSON.forEach(function(course){
    	if(course.code == 'CSCC24H3S'){
    		console.log(course.code + " => " + course.prerequisites);
    	}
    	// console.log(course.code + " => " + course.prerequisites);
    	// db.collection("programs").insertOne(program, function (err, r) {
     //        if (err) {
     //            console.log("Failed to insert document: " + program.name);
     //            db.close();
     //            return;
     //        }
     //        console.log("Added program: " + program.name);
     //        db.close();
     //    });
    })

    db.close();
});

var Course = function(code, ){

}