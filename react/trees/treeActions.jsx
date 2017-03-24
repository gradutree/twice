var AppDispatcher = require('../dispatcher.jsx');
var TreeConstants = require('./treeConstants.jsx');

var TreeActions = {

    loadUserData: function() {
        $.ajax({
            url: "/api/user/"+getCurrentUsername()+"/info",
            success: (function (result) {
                AppDispatcher.handleAction({
                    actionType: TreeConstants.LOAD_USERDATA,
                    data: result
                });
            }).bind(this),
            error: function (err) {
                console.log(err);
            }
        });
    },

    loadTreeInfo: function (code) {
        return $.ajax({
            url: "/api/path/"+code+"/pre",
            dataType: 'json',
            success: (function (result) {
                AppDispatcher.handleAction({
                    actionType: TreeConstants.LOAD_TREEDATA,
                    data: result
                });
            }),
        });
    },

    getUserProgram: function(user) {
        if(user && user.program){
            var userSpec = user.spec.toLowerCase();

            // User obj does not specifically define that they are a specialist, only the stream
            var programStr = (userSpec == 'major' || userSpec =='minor') ? userSpec :
                "specialist&spec="+user.spec.split(" ").join("");

            $.ajax({
                url: "/api/programs/"+user.program.split(" ").join("")+"?post="+programStr,
                success: (function (result) {
                    AppDispatcher.handleAction({
                        actionType: "GET_USER_PROGRAM",
                        data: result
                    });
                }),
                error: function (err) {
                    console.log(err);
                }
            });
        }
    },

    nodeClicked: function(courseCode) {
        AppDispatcher.handleAction({
            actionType: "NODE_CLICKED",
            data: courseCode
        });
    },

    getCourseInfo: function(courseCode) {
        $.ajax({
            url: "/api/courses/query?code="+courseCode,
            success: (function (result){
                AppDispatcher.handleAction({
                    actionType: 'UPDATE_COURSE_INFO',
                    data: result[0]
                });
            }),
            error: function (err) {
                console.log(err);
            }
        });
    },

    setTaken: function(username, courseCode) {
        $.ajax({
            url: "/api/users/"+username+"/taken/"+courseCode,
            type: "PATCH",
            success: (function (result){
                AppDispatcher.handleAction({
                    actionType: 'SET_TAKEN',
                    data: null
                });
            }),
            error: function (err){
                console.log(err);
            }
        });
    }
};

var getCurrentUsername = function () {
    var keyValuePairs = document.cookie.split('; ');
    for(var i in keyValuePairs){
        var keyValue = keyValuePairs[i].split('=');
        if(keyValue[0]=== 'username') return keyValue[1];
    }
    return null;
};

module.exports = TreeActions;
