var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var JsonRefs = require('../');

describe('gulp-json-refs', function() {
  describe('in buffer mode', function() {

    it('should resolve references', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: new Buffer('{ "desc": "abufferwiththiscontent" }')
      });

      // Create a JsonRefs plugin stream
      var myJsonRefs = JsonRefs();

      // write the fake file to it
      myJsonRefs.write(fakeFile);

      // wait for the file to come back out
      myJsonRefs.once('data', function(file) {
        // make sure it came out the same way it went in
        assert(file.isBuffer());

        // check the contents
        assert.equal(file.contents.toString('utf8'), '{ "desc": "aabufferwiththiscontent" }');
        done();
      });
    });
  });
});