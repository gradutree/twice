var Dispatcher = require('../dispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var merge = require('merge');
var Constants = require('./constants.jsx');

var courseData = {};
var reviews = {};

var loadCourse = function (data) {
    this.courseData = data;
};

var Store = merge(EventEmitter.prototype, {

    getCourseData: function() {
        return courseData;
    },

    getReviews: function() {
        return reviews;
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
Dispatcher.register(function(payload) {
    var action = payload.action;
    // Define what to do for certain actions
    switch(action.actionType) {
        case Constants.LOAD_COURSE:
            // Call internal method based upon dispatched action
            loadCourse(action.data);
            break;

        default:
            return true;
    }

    // If action was acted upon, emit change event
    Store.emitChange();

    return true;

});

module.exports = Store;