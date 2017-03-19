var AppDispatcher = require('../dispatcher.jsx');
var TreeConstants = require('./treeConstants.jsx');

var TreeActions = {

    cache: {},

    loadUserData: function() {
        if (this.cache[TreeConstants.LOAD_USERDATA]) {
            AppDispatcher.handleAction({
                actionType: TreeConstants.LOAD_USERDATA,
                data: this.cache[TreeConstants.LOAD_USERDATA]
            });
            return;
        }
        $.ajax({
            url: "/api/user/"+getCurrentUsername()+"/info",
            success: (function (result) {
                this.cache[TreeConstants.LOAD_USERDATA] = result;
                AppDispatcher.handleAction({
                    actionType: TreeConstants.LOAD_USERDATA,
                    data: result
                });
            }).bind(this),
            error: function (err) {
                console.log(err);
            }
        });
        //var data = {program: "Computer Science", user: "gengp", spec: "Software Engineering"};
    }

    // getSearchResults: function(search, callback) {
    //     $.ajax({
    //         url: "/api/courses/query?code="+search,
    //         success: callback,
    //         error: function (err) {
    //             console.log(err);
    //         }
    //     });
    // }

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