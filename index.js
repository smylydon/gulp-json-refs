var es = require("event-stream");
var clone = require("clone");
var JsonRefs = require("json-refs");
var YAML = require("yaml-js");

function getJsonMatch (filePath) {
  if (typeof filePath === "string") {
    return filePath.match(/\.json$/);
  }
}

function getYamlMatch (filePath) {
  if (typeof filePath === "string") {
    return filePath.match(/\.yaml$/);
  }
}

module.exports = function(opts) {
  "use strict";
  opts = opts || {};

  function resolveRefs(file, callback) {
    var options = clone(opts),
        fileContents;

    if (file.isNull()) {
      return callback(null, file);
    }

    // Parse YAML or JSON, depending on settings
    if (options.yaml && getYamlMatch(file.path)) {
      fileContents = YAML.load(file.contents);
    } else if (getJsonMatch(file.path)) {
      fileContents = JSON.parse(file.contents);
    } else {
      return callback(null, file);
    }

    // If location not specified, set it to the file's folder for relative references to work
    if (!options.location) {
      options.location = file.path.split("/").slice(0,-1).join("/");
    }

    JsonRefs.resolveRefs(fileContents, options).then(function (results) {
      var output = (options.yaml) ? YAML.dump(results.resolved) : JSON.stringify(results.resolved);
      file.contents = new Buffer(output);
      callback(null, file);
    }, function (error) {
      callback();
    });
  }

  return es.map(resolveRefs);
};