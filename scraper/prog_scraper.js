var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;


var url = "http://www.utsc.utoronto.ca/~registrar/calendars/calendar/Computer_Science.html";
var dbURL = "mongodb://localhost:27017/";

var Program = function (name) {
    this.name = name;
    this.specialist = []; // Contains objects {"stream":string, "courses":array of array of string}
    this.major = [];
    this.minor = [];
};

// ['CSCC01H3','CSCC09H3','CSCC10H3','CSCC11H3','CSCC24H3','CSCC37H3','CSCC43H3','CSCC63H3','CSCC69H3','CSCC73H3','CSCC85H3',
// 'CSCD01H3','CSCD03H3','CSCD18H3','CSCD27H3','CSCD37H3','CSCD43H3','CSCD54H3','CSCD58H3',,'CSCD71H3','CSCD72H3','CSCD84H3','CSCD90H3','CSCD92H3','CSCD94H3','CSCD95H3']

var compSci = new Program("Computer Science");
var compSciCore = [{"credits": 3.0, "courses": [['CSCA08H3'],['CSCA48H3'],['CSCA67H3'],['MATHA23H3'],['MATHA31H3'],['MATHA37H3']]},
                    {"credits": 3.5, "courses": [['CSCB07H3'],['CSCB09H3'],['CSCB36H3'],['CSCB58H3'],['CSCB63H3'],['MATB24H3'],['STAB52H3']]},
                    {"credits": 1.5, "courses": [['CSCC43H3'],['CSCC69H3'],['CSCC73H3']]},
                    {"credits": 0.5, "courses":[['CSCD03H3']]}];

var compSciComprehensive = [{"credits": 2.5, "courses": [['MATB41H3'],['CSCC24H3'],['CSCC37H3'],['CSCC63H3'],['CSCD37H3']]},
                            {"credits": 1.0, "courses": [['CSCC01H3'],['CSCC09H3'],['CSCC11H3'],['CSCC85H3'],['CSCD01H3'],['CSCD18H3'],
                                                        ['CSCD27H3'],['CSCD43H3'],['CSCD58H3'],['CSCD84H3']]}, 
                            {"credits": 0.5, "courses": [['MATC09H3'],['MATC16H3'],['MATC32H3'],['MATC44H3']]}];

var compSciSoftwareEng = [{"credits": 3.0, "courses": [['MATB41H3'],['CSCC01H3'],['CSCC24H3'],['CSCC37H3'],['CSCC63H3'],['CSCD01H3']]},
                            {"credits": 1.5, "courses": [['CSCC09H3'],['CSCC11H3'],['CSCC85H3'],['CSCD18H3'],['CSCD27H3'],['CSCD58H3'],['CSCD84H3']]}];

var compSciInfoSystem = [{"credits": 1.5, "courses": [['MGTA01H3'],['MGTA02H3'],['MGHB02H3']]},
                            {"credits": 3.0, "courses": [['MATB41H3'],['CSCC01H3'],['CSCC37H3'],['CSCC63H3'],['CSCD01H3'],['CSCD43H3']]},
                            {"credits": 1.0, "courses": [['CSCC09H3'],['CSCC11H3'],['CSCC85H3'],['CSCD18H3'],['CSCD27H3'],['CSCD58H3'],['CSCD84H3']]}];

var compSciHealthInfo = [{"credits": 2.0, "courses": [['PHLB09H3'],['MGTA06H3'],['HLTB16H3','HLTB17H3','HLTB40H3','HLTC40H3'],['HLTB22H3','HLTC05H3']]},
                            {"credits": 1.5, "courses": [['CSCC01H3'],['STAB57H3'],['STAC50H3']]},
                            {"credits": 0.5, "courses": [['MATB41H3']]},
                            {"credits": 2.0, "courses": [['CSCC09H3'],['CSCC10H3'],['CSCC11H3'],['CSCC24H3'],['CSCC37H3'],['CSCC63H3'],['CSCC85H3'],['CSCD01H3'],
                                                        ['CSCD18H3'],['CSCD27H3'],['CSCD37H3'],['CSCD43H3'],['CSCD54H3'],['CSCD58H3'],['CSCD71H3'],['CSCD72H3'],
                                                        ['CSCD84H3'],['CSCD90H3'],['CSCD92H3'],['CSCD94H3'],['CSCD95H3']]}];

var compSciEntreprenuer = [{"credits": 3.0, "courses": [['CSCC01H3'],['CSCC37H3'],['CSCC63H3'],['CSCD01H3'],['CSCD54H3'],['CSCD90H3']]},
                            {"credits": 1.5, "courses": [['MATHB41H3'],['STAB57H3'],['CSCC09H3'],['CSCC11H3'],['CSCC24H3'],['CSCC85H3'],['CSCD18H3'],
                                                        ['CSCD27H3'],['CSCD43H3'],['CSCD58H3'],['CSCD84H3']]}];

compSci.specialist.push({"stream": "Comprehensive", "reqs": compSciCore.concat(compSciComprehensive)});
compSci.specialist.push({"stream": "Software Engineering", "reqs": compSciCore.concat(compSciSoftwareEng)});
compSci.specialist.push({"stream": "Information Systems", "reqs": compSciCore.concat(compSciInfoSystem)});
compSci.specialist.push({"stream": "Health Informatics", "reqs": compSciCore.concat(compSciHealthInfo)});
compSci.specialist.push({"stream": "Entrepreneurship", "reqs": compSciCore.concat(compSciEntreprenuer)});

compSci.major = [{"credits": 3.0, "courses": [['CSCA08H3'],['CSCA48H3'],['CSCA67H3'],['MATA23H3'],['MATA31H3'],['MATA37H3']]},
                {"credits": 3.0, "courses": [['CSCB07H3'],['CSCB09H3'],['CSCB36H3'],['CSCB58H3'],['CSCB63H3'],['MATB24H3','STAB52H3']]},
                {"credits": 1.0, "courses": [['CSCC37H3'],['CSCC63H3','CSCC73H3']]},
                {"credits": 1.0, "courses": [['CSCC01H3'],['CSCC09H3'],['CSCC10H3'],['CSCC11H3'],['CSCC24H3'],['CSCC43H3'],['CSCC63H3'],['CSCC69H3'],
                                            ['CSCC73H3'],['CSCC85H3'],['CSCD01H3'],['CSCD03H3'],['CSCD18H3'],['CSCD27H3'],['CSCD37H3'],['CSCD43H3'],['CSCD54H3'],
                                            ['CSCD58H3'],,['CSCD71H3'],['CSCD72H3'],['CSCD84H3'],['CSCD90H3'],['CSCD92H3'],['CSCD94H3'],['CSCD95H3']]}];

compSci.minor = [{"credits": 1.0, "courses": [['CSCA08H3','CSCA20H3'],['CSCA48H3']]},
                {"credits": 0.5, "courses": [['CSCA67H3'],['MATA67H3'],['MATA23H3'],['MATA30H3'],['MATA31H3'],['MATA32H3'],['PHLB50H3']]},
                {"credits": 1.5, "courses": [['CSCB07H3'],['CSCB09H3'],['CSCB20H3'],['CSCB36H3'],['CSCB58H3'],['CSCB63H3']]},
                {"credits": 1.0, "courses": [['CSCC01H3'],['CSCC09H3'],['CSCC10H3'],['CSCC11H3'],['CSCC24H3'],['CSCC37H3'],['CSCC43H3'],['CSCC63H3'],['CSCC69H3'],
                                            ['CSCC73H3'],['CSCC85H3'],['CSCD01H3'],['CSCD03H3'],['CSCD18H3'],['CSCD27H3'],['CSCD37H3'],['CSCD43H3'],['CSCD54H3'],
                                            ['CSCD58H3'],,['CSCD71H3'],['CSCD72H3'],['CSCD84H3'],['CSCD90H3'],['CSCD92H3'],['CSCD94H3'],['CSCD95H3']]}];


var addProgram = function(dbName, program){
    dbURL += dbName;
    MongoClient.connect(dbURL, function (err, db) {
        if (err) {
            console.log(err);
            return;
        }

        // Check if program already exists
        db.collection("programs").findOne({name: program.name}).then(function(result){
            if(result){
                db.close();
                return;
            }

            db.collection("programs").insertOne(program, function (err, r) {
                if (err) {
                    console.log("Failed to insert document: " + program.name);
                    db.close();
                    return;
                }
                console.log("Added program: " + program.name);
                db.close();
            });
        });
    });
};

if (process.argv.length != 3) {
    console.log("Usage: prog_scraper.js [Database Name]");
} else {
    addProgram(process.argv[2], compSci);
}
