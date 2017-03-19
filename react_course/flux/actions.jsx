var Dispatcher = require('./dispatcher.jsx');
var Constants = require('./constants.jsx');

var Actions = {

    cache: {},

    loadCourseInfo: function (code) {
        $.ajax({
            url: "/api/courses/query?code="+code,
            success: function (result) {
                Dispatcher.handleAction({
                    actionType: Constants.LOAD_COURSE,
                    data: result[0]
                });
            }
        });
    },
    
    loadReviews: function (code, page) {
        $.ajax({
            url: "/api/course/"+code+"/review/"+page,
            success: function (result) {
                Dispatcher.handleAction({
                    actionType: page > 0 ? Constants.APPEND_REVIEWS : Constants.LOAD_REVIEWS,
                    data: result
                });
            }
        });
    },

    submitReview: function (code, content) {
        $.ajax({
            url: "/api/review",
            method: "POST",
            data: JSON.stringify({content: content, code: code}),
            contentType: "application/json",
            processData: false,
            success: function (result) {
                console.log(result);
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