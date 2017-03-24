var AppDispatcher = require('../dispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var merge = require('merge');
var TreeConstants = require('./treeConstants.jsx');

var userData = {};
var userProgram = [];
var nodeClicked = "";
var courseInfo = null;
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

function loadNodeClicked(courseCode){
    nodeClicked = courseCode;
}

function loadCourseInfo(course){
    courseInfo = course;
}

function loadTaken(courseCode) {
    if(userData.taken && userData.taken.indexOf(courseCode) < 0) {
        userData.taken.push(courseCode);
    }
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

    getNodeClicked: function() {
        return nodeClicked;
    },

    getCourseInfo: function() {
        return courseInfo;
    },

    getUserSpec: function() {
        return userData.spec;
    },

    getUserTaken: function() {
        return userData.taken;
    },

    emitChange: function() {
        this.emit('change');
    },

    emitTreeDataChange: function() {
        this.emit('treechange');
    },

    emitProgramChange: function() {
        this.setMaxListeners(100);
        this.emit('programChange');
    },

    emitNodeClicked: function() {
        this.emit('nodeClicked');
    },

    emitUpdateCourseInfo: function() {
        this.emit('updateCourseInfo');
    },

    emitSetTaken: function() {
        this.emit('setTaken');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },

    addTreeChangeListner: function(callback) {
        this.on('treechange', callback);
    },

    addProgramChangeListener: function(callback) {
        this.on('programChange', callback);
    },

    removeProgramChangeListener: function(callback) {
        this.removeListener('programChange', callback);
    },

    addNodeClickedListener: function(callback) {
        this.on('nodeClicked', callback);
    },

    removeNodeClickedListener: function(callback) {
        this.removeListener('nodeClicked', callback);
    },

    addUpdateCourseInfoListener: function(callback) {
        this.on('updateCourseInfo', callback);
    },

    removeUpdateCourseInfoListener: function(callback) {
        this.removeListener('updateCourseInfo', callback);
    },

    addSetTakenListener: function(callback) {
        this.on('setTaken', callback);
    },

    removeSetTakenListener: function(callback) {
        this.removeListener('setTaken', callback);
    }

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
            loadTreeData(action.data);
            TreeStore.emitTreeDataChange();
            break;

        case 'GET_USER_PROGRAM':
            loadUserProgram(action.data);
            TreeStore.emitProgramChange();
            break;

        case 'NODE_CLICKED':
            loadNodeClicked(action.data);
            TreeStore.emitNodeClicked();
            break;

        case 'UPDATE_COURSE_INFO':
            loadCourseInfo(action.data);
            TreeStore.emitUpdateCourseInfo();
            break;

        case 'SET_TAKEN':
            loadTaken(action.data);
            TreeStore.emitSetTaken();

        default:
            return true;
    }

    // // If action was acted upon, emit change event
    // TreeStore.emitChange();

    return true;

});

module.exports = TreeStore;
