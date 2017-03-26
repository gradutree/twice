var Dispatcher = require('./dispatcher.jsx');
var Constants = require('./constants.jsx');

var Actions = {

    cache: {},

    query: null,
    
    searchCourses(query) {
        if (query.length < 3) return;
        this.query = query;
        $.ajax({
            url: "/api/courses/query?code="+query,
            success: function (results) {
                if (this.query == query) {
                    Dispatcher.handleAction({
                        actionType: Constants.SEARCH,
                        data: results
                    });
                }
            }.bind(this)
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