var es = require("event-stream");
var clone = require("clone");
var JsonRefs = require("json-refs");
var YAML = require("js-yaml");

module.exports = function(opts) {
  "use strict";
  opts = opts || {};

  function resolveRefs(file, callback) {
    var options = clone(opts);

    if (file.isNull()) {
      return callback(null, file);
    }

    options.loaderOptions = {
        processContent: function (res, callback) {
          callback(undefined, YAML.safeLoad(res.text));
        }
    };

    JsonRefs.resolveRefsAt(file.path, options).then(function (results) {
      var output = (options.yaml) ? YAML.safeDump(results.resolved, {noRefs: true}) : JSON.stringify(results.resolved);
      file.contents = new Buffer(output);
      callback(null, file);
    }, function (error) {
      callback();
    });
  }

  return es.map(resolveRefs);
};
