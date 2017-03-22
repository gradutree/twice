var AppDispatcher = require('../dispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var merge = require('merge');
var TreeConstants = require('./treeConstants.jsx');

var userData = {};
var userProgram = [];
var treeData =  [];

function loadUserData(data) {
    userData = data;
}

function loadTreeData(data) {
    var newObject = JSON.parse(JSON.stringify(data));
    treeData.push(newObject);

}



function loadUserProgram(data) {
    userProgram = data;
}


var TreeStore = merge(EventEmitter.prototype, {

    getUserData: function() {
        return userData;
    },

    getTreeData: function() {
        return treeData;
    },

    getUserProgramReq: function() {
        return userProgram;
    },

    getUserSpec: function() {
        return userData.spec;
    },

    getUserTaken: function() {
        return userData.taken;
    },

    // getSearchResults: function() {
    //     return searchResults;
    // },

    emitChange: function() {
        this.emit('change');
    },
    emitTreeDataChange: function() {
        this.emit('treechange');
    },


    emitProgramChange: function() {
        this.emit('programChange');
    },

    addTreeChangeListner: function(callback) {
        this.on('treechange', callback);
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },

    addProgramChangeListener: function(callback) {
        this.on('programChange', callback);
    },

    removeProgramChangeListener: function(callback) {
        this.removeListener('programChange', callback);
    },

});

// Register dispatcher callback
AppDispatcher.register(function(payload) {
    var action = payload.action;
    // Define what to do for certain actions
    switch(action.actionType) {
        case TreeConstants.LOAD_USERDATA:
            // Call internal method based upon dispatched action
            loadUserData(action.data);
            TreeStore.emitChange();
            break;

        case TreeConstants.LOAD_TREEDATA:
            // Call internal method based upon dispatched action
//            console.log(action.data);
            loadTreeData(action.data);
            TreeStore.emitTreeDataChange();
            break;


        case 'GET_USER_PROGRAM':
            loadUserProgram(action.data);
            TreeStore.emitProgramChange();
            break;

        default:
            return true;
    }

    // // If action was acted upon, emit change event
    // TreeStore.emitChange();

    return true;

});

module.exports = TreeStore;
