var Dispatcher = require('../dispatcher.jsx');
var Constants = require('./constants.jsx');

var Actions = {

    cache: {},

    loadCourseInfo: function (code) {
        $.ajax({
            url: "api/courses/query?code="+code,
            success: function (result) {
                
            }
        });
    }
        //var data = {program: "Computer Science", user: "gengp", spec: "Software Engineering"};



};

var getCurrentUsername = function () {
    var keyValuePairs = document.cookie.split('; ');
    for(var i in keyValuePairs){
        var keyValue = keyValuePairs[i].split('=');
        if(keyValue[0]=== 'username') return keyValue[1];
    }
    return null;
};

module.exports = Actions;