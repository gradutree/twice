var AppDispatcher = require('../dispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var merge = require('merge');
var DashConstants = require('./dashboardConstants.jsx');

// Internal object of shoes
var userData = {};

function loadUserData(data) {

    userData = data;
}

// Merge our store with Node's Event Emitter
var DashStore = merge(EventEmitter.prototype, {

    getUserData: function() {
        return userData.user;
    },

    getUserProgram: function() {
        return userData.program;
    },

    getUserSpec: function() {

        return userData.spec;
    },

    emitChange: function() {
        this.emit('change');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }

});

// Register dispatcher callback
AppDispatcher.register(function(payload) {
    var action = payload.action;
    // Define what to do for certain actions
    switch(action.actionType) {
        case DashConstants.LOAD_USERDATA:
            // Call internal method based upon dispatched action
            loadUserData(action.data);
            break;

        default:
            return true;
    }

    // If action was acted upon, emit change event
    DashStore.emitChange();

    return true;

});

module.exports = DashStore;