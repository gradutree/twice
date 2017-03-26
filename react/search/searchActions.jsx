var AppDispatcher = require('../dispatcher.jsx');
var SearchConstants = require('./searchConstants.jsx');

var SearchActions = {

    cache: {},

    loadUserData: function() {
        if (this.cache[SearchConstants.LOAD_USERDATA]) {
            AppDispatcher.handleAction({
                actionType: SearchConstants.LOAD_USERDATA,
                data: this.cache[SearchConstants.LOAD_USERDATA]
            });
            return;
        }
        $.ajax({
            url: "/api/user/"+getCurrentUsername()+"/info",
            success: (function (result) {
                this.cache[SearchConstants.LOAD_USERDATA] = result;
                AppDispatcher.handleAction({
                    actionType: SearchConstants.LOAD_USERDATA,
                    data: result
                });
            }).bind(this),
            error: function (err) {
                console.log(err);
            }
        });
    },

    getSearchResults: function(search) {
        if (search.length < 3) return;
        $.ajax({
            url: "/api/courses/query?code="+search,
            success: (function (result){
                AppDispatcher.handleAction({
                    actionType: 'SEARCH_RESULTS',
                    data: result
                });
            }),
            error: function (err) {
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

module.exports = SearchActions;