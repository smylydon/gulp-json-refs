var gulp = require("gulp");
var gulpJsonRefs = require("../index.js");
var es = require("event-stream");
var path = require("path");
var assert = require("assert");
var YAML = require("js-yaml");

require("mocha");

describe("gulp-json-refs", function() {
  "use strict";

  function compareResults (done, options) {
    options = options || {};

    return es.map(function (file) {
      var result = String(file.contents);
      var expected = options.expected;
      assert.equal(result, expected);
      done();
    });
  }

  describe("json parsing", function () {
    it ("should resolve same file refs", function (done) {
      gulp.src(path.join(__dirname, "./fixtures/same-file-reference.json"))
        .pipe(gulpJsonRefs())
        .pipe(compareResults(done, {
          expected: JSON.stringify({
            "name": {
              "first": "Bob",
              "last": "Loblaw"
            },
            "owner": {
              "first": "Bob",
              "last": "Loblaw"
            }
          })
        }));
    });

    it ("should resolve local file refs", function (done) {
      gulp.src(path.join(__dirname, "./fixtures/local-file-reference.json"))
        .pipe(gulpJsonRefs())
        .pipe(compareResults(done, {
          expected: JSON.stringify({
            "author": {
              "first": "Bob",
              "last": "Loblaw"
            }
          })
        }));
    });

    it ("should resolve references in a referenced file", function (done) {
      gulp.src(path.join(__dirname, "./fixtures/refer-to-reference.json"))
        .pipe(gulpJsonRefs())
        .pipe(compareResults(done, {
          expected: JSON.stringify({
            "title": "json",
            "author": {
              "first": "Bob",
              "last": "Loblaw"
            }
          })
        }));
    });

    it ("should resolve remote refs", function (done) {
      gulp.src(path.join(__dirname, "./fixtures/remote-reference.json"))
        .pipe(gulpJsonRefs())
        .pipe(compareResults(done, {
          expected: JSON.stringify({
            "name": "json-refs",
            "owner": "whitlockjc"
          })
        }));
    });
  });

  describe("yaml parsing", function () {
    it ("should resolve same file refs", function (done) {
      gulp.src(path.join(__dirname, "./fixtures/same-file-reference.yaml"))
        .pipe(gulpJsonRefs({ "yaml": true }))
        .pipe(compareResults(done, {
          expected: YAML.safeDump({
            "name": {
              "first": "Bob",
              "last": "Loblaw"
            },
            "owner": {
              "first": "Bob",
              "last": "Loblaw"
            }
          })
        }));
    });

    it ("should resolve local JSON file refs", function (done) {
      gulp.src(path.join(__dirname, "./fixtures/local-file-reference.yaml"))
        .pipe(gulpJsonRefs({ "yaml": true }))
        .pipe(compareResults(done, {
          expected: YAML.safeDump({
            "author": {
              "first": "Bob",
              "last": "Loblaw"
            }
          })
        }));
    });

    it ("should resolve references in a referenced JSON file", function (done) {
      gulp.src(path.join(__dirname, "./fixtures/refer-to-reference.yaml"))
        .pipe(gulpJsonRefs({ "yaml": true }))
        .pipe(compareResults(done, {
          expected: YAML.safeDump({
            "title": "json",
            "author": {
              "first": "Bob",
              "last": "Loblaw"
            }
          })
        }));
    });

    it ("should resolve remote JSON refs", function (done) {
      gulp.src(path.join(__dirname, "./fixtures/remote-reference.yaml"))
        .pipe(gulpJsonRefs({ "yaml": true }))
        .pipe(compareResults(done, {
          expected: YAML.safeDump({
            "name": "json-refs",
            "owner": "whitlockjc"
          })
        }));
    });  });
});

// Use cases
// same file with path  "$ref": "#/definitions/address"
// other file           "$ref": "/example.json"
// other with path      "$ref": "/example.json#/foo/inner%20object/baz"
// other with path      "$ref": "/example.json#/foo/bar/0"
