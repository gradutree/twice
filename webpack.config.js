var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'frontend/static/js/app');
var APP_DIR = path.resolve(__dirname, 'react/');
var COURSE_DIR = path.resolve(__dirname, 'react_course/');
var MAIN_DIR = path.resolve(__dirname, 'react_main/');

var config = {
  entry: {
	  app: APP_DIR + '/index.jsx',
	  course: COURSE_DIR + '/index.jsx',
	  main: MAIN_DIR + '/index.jsx'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name]_bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel-loader'
      }
    ]
  }
};

module.exports = config;