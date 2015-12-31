var es = require("event-stream");
var clone = require("clone");
var JsonRefs = require("json-refs");

function getJsonMatch (filePath) {
  if (typeof filePath === "string") {
    return filePath.match(/.json$/);
  }
}

module.exports = function(opts) {
  "use strict";
  opts = opts || {};

  function resolveRefs(file, callback) {
    var options = clone(opts);

    if (file.isNull() || !getJsonMatch(file.path)) {
      return callback(null, file);
    }

    // If location not specified, set it to the file's folder for relative references to work
    if (!options.location) {
      options.location = file.path.split("/").slice(0,-1).join("/");
    }

    JsonRefs.resolveRefs(JSON.parse(file.contents), options).then(function (results) {
      file.contents = new Buffer(JSON.stringify(results.resolved));
      callback(null, file);
    }, function (error) {
      callback();
    });
  }

  return es.map(resolveRefs);
};