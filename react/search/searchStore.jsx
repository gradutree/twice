var AppDispatcher = require('../dispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var merge = require('merge');
var SearchConstants = require('./searchConstants.jsx');

var userData = {};
var searchResults = [];

function loadUserData(data) {
    userData = data;
}

function loadSearchResults(data) {
    searchResults = data;
}

var SearchStore = merge(EventEmitter.prototype, {

    getUserData: function() {
        return userData;
    },

    getUserProgram: function() {
        return userData.program;
    },

    getUserSpec: function() {
        return userData.spec;
    },

    getUserTaken: function() {
        return userData.taken;
    },

    getSearchResults: function() {
        return searchResults;
    },

    emitChange: function() {
        this.emit('change');
    },

    emitSearchChange: function() {
        this.emit('searchChange');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },

    addSearchChangeListener: function(callback) {
        this.on('searchChange', callback);
    },

    removeSearchChangeListener: function(callback) {
        this.removeListener('searchChange', callback);
    }

});

// Register dispatcher callback
AppDispatcher.register(function(payload) {
    var action = payload.action;
    // Define what to do for certain actions
    switch(action.actionType) {
        case SearchConstants.LOAD_USERDATA:
            // Call internal method based upon dispatched action
            loadUserData(action.data);
            SearchStore.emitChange();
            break;

        case 'SEARCH_RESULTS':
            loadSearchResults(action.data);
            SearchStore.emitSearchChange();
            break;

        default:
            return true;
    }

    // If action was acted upon, emit change event
    // SearchStore.emitChange();

    return true;

});

module.exports = SearchStore;
