var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;

var url = "http://www.utsc.utoronto.ca/~registrar/calendars/calendar/Computer_Science.html";
var dbURL = "mongodb://35.167.141.109:8000/";

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
            var elems = $("strong");
            var program = new Program("Computer Science");
            var core = [];

            elems.each(function (i, item) {
                var data = $(this);
                // console.log(data.text());
                // ref++;
                var corePattern = /Core/;
                var specialistPattern = /[A-Z]\. /;

                if (corePattern.test(data.text())) {
                    // console.log(data[0].children[0].data);
                    // console.log(data.parent().next()[0].children[1]);
                    // console.log(data.parent().siblings().children().text());

                    var sectionPattern = /[2-9]. [A-Z]/;
                    data.parent().next()[0].children.forEach(function(item){
                        if(item.type == 'tag' && item.name != 'br'){
                            var elemType = item.name;
                            var innerHTML = item.children[0].data;
                        } else return;

                        // Find divisions of the core requirements
                        if(elemType == 'strong' && sectionPattern.test(innerHTML)){
                            while (item.next.name != 'strong'){
                                // Find the course name under each core course section
                                if(item.next.name == 'a'){
                                    core.push([item.next.children[0].data]);
                                }
                                item = item.next;
                            }
                        }
                    });

                } else if(specialistPattern.test(data.text())){
                    // console.log(data.text().split(specialistPattern.exec(data.text()))[1]);
                    var streamName = data.text().split(specialistPattern.exec(data.text()))[1].split(" Stream")[0];
                    console.log(streamName);

                    var sectionPattern = /[2-9]\. [A-Z]/;
                    var current = data.parent().next();
                    
                    if(streamName == streamName){
                        do {
                            console.log(current.text());
                            console.log(sectionPattern.test(current.text()));
                            if(specialistPattern.test(current.text())){
                                break;
                            }
                            current = current.next();
                        } while (sectionPattern.test(current.text()));


                        // console.log(current.text());
                        // console.log(sectionPattern.test(current.text()));

                        // while(sectionPattern.test(current.text())){
                        //     // console.log(current.text());

                        //     // console.log(current.children()[0].children[0].data);
                        //     // // console.log(data.parent().next()[0].children);
                        //     // data.parent().next()[0].children.forEach(function(item){
                        //     //     if(item.type == 'tag' && item.name == 'a'){
                        //     //         console.log(item.children[0].data);
                        //     //     }
                        //     // }); 

                        //     // current = current.next().children();
                        //     // console.log(current.parent().next().text());
                        //     if(specialistPattern.test(current.text())){
                        //         break;
                        //     }
                        //     // old = current; 
                        //     current = current.next();
                        //     console.log(current.text());
                        //     console.log(sectionPattern.test(current.text()));
                        //     if(specialistPattern.test(old.text())){
                        //         break;
                        //     }
                        // }

                        // console.log(current.children()[0].children[0].data);
                        // // console.log(data.parent().next()[0].children);
                        // data.parent().next()[0].children.forEach(function(item){
                        //     if(item.type == 'tag' && item.name == 'a'){
                        //         console.log(item.children[0].data);
                        //     }
                        // }); 

                        // // current = current.next().children();
                        // current = current.next().children();
                        // console.log(current.text());
                    }
                    // data.parent().next()[0].children.forEach(function(item){
                    //     // console.log(data[0].children[0].data);
                    // // console.log(data.parent().next()[0].children[1]);
                    // // console.log(data.parent().siblings().children().text());

                    //     // if(item.type == 'tag' && item.name != 'br'){
                    //     //     var elemType = item.name;
                    //     //     var innerHTML = item.children[0].data;
                    //     // } else return;
                    //     if(item.type == 'tag' && item.name != 'br' && item.children[0] == undefined){
                    //         console.log(item);
                    //     }

                    //     // // Find divisions of the core requirements
                    //     // if(item.name == 'strong' && sectionPattern.test(item.children[0].data)){
                    //     //     console.log(item.children[0].data);
                    //     //     // while (item.next.name != 'strong'){
                    //     //     //     // Find the course name under each core course section
                    //     //     //     if(item.next.name == 'a'){
                    //     //     //         core.push(item.next.children[0].data);
                    //     //     //     }
                    //     //     //     item = item.next;
                    //     //     // }
                    //     // }
                    // // });
                    // });
                }


            });

            // console.log(core);
            db.close();

        });
    });
};

var Program = function (name) {
    this.name = name;
    this.specialist = []; // Contains objects {"stream":string, "courses":array of string or obj {"credits":int, "courses":array of string}}
    this.major = [];
    this.minor = [];
};

['CSCC01H3','CSCC09H3','CSCC10H3','CSCC11H3','CSCC24H3','CSCC37H3','CSCC43H3','CSCC63H3','CSCC69H3','CSCC73H3','CSCC85H3',
'CSCD01H3','CSCD03H3','CSCD18H3','CSCD27H3','CSCD37H3','CSCD43H3','CSCD54H3','CSCD58H3',,'CSCD71H3','CSCD72H3','CSCD84H3','CSCD90H3','CSCD92H3','CSCD94H3','CSCD95H3']

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

console.log(compSci);


// console.log(compSciCore.concat(compSciComprehensive));


// if (process.argv.length != 3) {
//     console.log("Usage: index.js [Database Name]");
// } else {
//     addCourses(process.argv[2]);
// }
