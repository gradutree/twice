var Dispatcher = require('./dispatcher.jsx');
var Constants = require('./constants.jsx');

var Actions = {

    cache: {},

    searchCourses(query) {
        if (query.length < 3) return;
        $.ajax({
            url: "/api/courses/query?code="+query,
            success: function (results) {
                Dispatcher.handleAction({
                    actionType: Constants.SEARCH,
                    data: results
                });
            }
        })
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