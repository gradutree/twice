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
        userData.allCourses.push(courseCode);
    }
}

function deleteTaken(courseCode) {
    if(userData.taken && userData.taken.indexOf(courseCode) < 0) {
        userData.taken.splice(userData.taken.indexOf(courseCode));
        userData.taken.splice(userData.allCourses.indexOf(courseCode));
    }
}

function loadAllCourses(courseCode) {
    if(userData.allCourses && userData.allCourses.indexOf(courseCode) < 0) {
        userData.allCourses.push(courseCode);
    }
}

function deleteAllCourses(courseCode) {
    if(userData.allCourses && userData.allCourses.indexOf(courseCode) < 0) {
        userData.allCourses.splice(userData.allCourses.indexOf(courseCode));
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

    getUserAllCourses: function() {
        return userData.allCourses;
    },

    emitChange: function() {
        this.emit('change');
    },

    emitTreeDataChange: function() {
        this.emit('treechange');
    },

    emitGraphCreated: function() {
        this.emit('graphCreated');
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

    emitDeleteTaken: function() {
        this.emit('deleteTaken');
    },

    emitSetAllCourses: function() {
        this.emit('setAllCourses');
    },

    emitDeleteAllCourses: function() {
        this.emit('deleteAllCourses');
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

    removeTreeChangeListner: function(callback) {
        this.removeListener('treechange', callback);
    },

    addGraphCreatedListner: function(callback) {
        this.on('graphCreated', callback);
    },

    removeGraphCreatedListner: function(callback) {
        this.removeListener('graphCreated', callback);
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
    },

    addDeleteTakenListener: function(callback) {
        this.on('deleteTaken', callback);
    },

    removeDeleteTakenListener: function(callback) {
        this.removeListener('deleteTaken', callback);
    },

    addSetAllCoursesListener: function(callback) {
        this.on('setAllCourses', callback);
    },

    removeSetAllCoursesListener: function(callback) {
        this.removeListener('setAllCourses', callback);
    },

    addDeleteAllCoursesListener: function(callback) {
        this.on('deleteAllCourses', callback);
    },

    removeDeleteAllCoursesListener: function(callback) {
        this.removeListener('deleteAllCourses', callback);
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
            loadTreeData(action.data);
            TreeStore.emitTreeDataChange();
            break;

        case 'GRAPH_CREATED':
            TreeStore.emitGraphCreated();
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

        case 'DELETE_TAKEN':
            deleteTaken(action.data);
            TreeStore.emitDeleteTaken();

        case 'SET_ALL_COURSES':
            loadAllCourses(action.data);
            TreeStore.emitSetAllCourses();

        case 'DELETE_ALL_COURSES':
            deleteAllCourses(action.data);
            TreeStore.emitDeleteAllCourses();

        default:
            return true;
    }

    // // If action was acted upon, emit change event
    // TreeStore.emitChange();

    return true;

});

module.exports = TreeStore;
