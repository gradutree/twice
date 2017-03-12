var AppDispatcher = require('../dispatcher.jsx');
var DashConstants = require('./dashboardConstants.jsx');

var DashActions = {

    cache: {},

    loadUserData: function() {
        if (this.cache[DashConstants.LOAD_USERDATA]) {
            AppDispatcher.handleAction({
                actionType: DashConstants.LOAD_USERDATA,
                data: this.cache[DashConstants.LOAD_USERDATA]
            });
            return;
        }
        $.ajax({
            url: "/api/user/"+getCurrentUsername()+"/info",
            success: (function (result) {
                this.cache[DashConstants.LOAD_USERDATA] = result;
                AppDispatcher.handleAction({
                    actionType: DashConstants.LOAD_USERDATA,
                    data: result
                });
            }).bind(this),
            error: function (err) {
                console.log(err);
            }
        });
        //var data = {program: "Computer Science", user: "gengp", spec: "Software Engineering"};

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

module.exports = DashActions;