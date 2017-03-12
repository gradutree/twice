var AppDispatcher = require('../dispatcher.jsx');
var DashConstants = require('./dashboardConstants.jsx');

var DashActions = {

    loadUserData: function() {
        var data = {program: "Test", user: "Test"};
        AppDispatcher.handleAction({
            actionType: DashConstants.LOAD_USERDATA,
            data: data
        })
    }

};

module.exports = DashActions;