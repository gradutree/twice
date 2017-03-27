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
                Actions.loadReviews(code, 0);
                Dispatcher.handleAction({
                    actionType: Constants.SET_REVIEWED,
                    data: true
                });
                document.getElementById("review_form").reset();
            }
        })
    },
    
    vote: function (code, dir) {
        Dispatcher.handleAction({
            actionType: Constants.VOTE,
            data: dir
        });
        $.ajax({
            url: "/api/course/"+code+"/vote/"+dir,
            method: "POST",
            success: function (result) {

            }
        })
    },

    voteReview: function(id, dir) {
        $.ajax({
            url: "/api/review/"+id+"/vote/"+dir,
            method: "POST",
            success: function (result) {

            }
        })
    },

    loadRec: function (code) {
        $.ajax({
            url: "/api/courses/"+code+"/recommend",
            success: function (result) {
                Dispatcher.handleAction({
                    actionType: Constants.LOAD_REC,
                    data: result
                });
            }
        })
    },

    searchCourses(query) {
        if (query == "") {
            Dispatcher.handleAction({
                actionType: Constants.SEARCH,
                data: []
            });
            return;
        }
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