'use strict';
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var JsonRefs = require('json-refs');

var PLUGIN_NAME = 'gulp-json-refs';

function trycatch(fn, handle) {
  try {
    return fn();
  } catch (e) {
    return handle(e);
  }
}

function setup(opts) {
  var options = deap({}, opts);


  return options;
}

function createError(file, err) {
  if (typeof err === 'string') {
    return new PluginError(pluginName, file.path + ': ' + err, {
      fileName: file.path,
      showStack: false
    });
  }

  var msg = err.message || err.msg || /* istanbul ignore next */ 'unspecified error';

  return new PluginError(pluginName, file.path + ': ' + msg, {
    fileName: file.path,
    lineNumber: err.line,
    stack: err.stack,
    showStack: false
  });
}

module.exports = function(opts) {
  function json_res(file, encoding, callback) {
    var options = opts || {};

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(createError(file, 'Streaming not supported'));
    }

    // Check to see if file is valid JSON
    var jsonData = trycatch(function() {
      return JSON.parse(file.contents);
    }, createError.bind(file, 'File not valid JSON'));

    if (jsonData instanceof PluginError) {
      return callback(jsonData);
    }

    // Attempt to run Json_Ref on the file data
    var res = trycatch(function() {
      return JsonRefs.resolveRefs(jsonData);
    }, createError.bind(null, file));

    if (res instanceof PluginError) {
      return callback(res);
    }

    // res is a promise
    res.then(function (results) {
      file.contents = results.resolved;
      if (options.showMetaData) {
        console.log(results.metadata);
      }
      callback(null, file);
    });
  }

  return through.obj(json_res);
};