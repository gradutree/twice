var Dispatcher = require('./dispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var merge = require('merge');
var Constants = require('./constants.jsx');

var courseData = {};
var reviews = {};

var loadCourse = function (data) {
    courseData = data;
};

var loadReviews = function (data) {
    console.log(data);
    reviews = data;

};

var appendReviews = function (data) {
    reviews.data = reviews.data.concat(data.data);
    reviews.page = data.page;
    reviews.more = data.more;
};

var setVoteData = function (dir) {
    if (dir == "1") {
        if (courseData.user_state == "0") courseData.liked++;
        else if (courseData.user_state == "-1") {
            courseData.liked++;
            courseData.disliked--;
        }
    } else if (dir == "0") {
        if (courseData.user_state == "1") courseData.liked--;
        else if (courseData.user_state == "-1") courseData.disliked++;
    } else {
        if (courseData.user_state == "0") courseData.disliked++;
        else if (courseData.user_state == "1") {
            courseData.liked--;
            courseData.disliked++;
        }
    }
    courseData.user_state = dir;
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
        case Constants.LOAD_REVIEWS:
            // Call internal method based upon dispatched action
            loadReviews(action.data);
            break;
        case Constants.APPEND_REVIEWS:
            appendReviews(action.data);
            break;
        case Constants.VOTE:
            setVoteData(action.data);
            break;
        default:
            return true;
    }

    // If action was acted upon, emit change event
    Store.emitChange();

    return true;

});

module.exports = Store;