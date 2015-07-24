# gulp-json-refs

Gulp wrapper for [json-refs] - Various utilities for [JSON References][json-reference-draft-spec], and [JSON Pointers][json-pointer-spec] since JSON
References are part JSON Pointer.

## Project Badges

* Build status: [![Build Status](https://travis-ci.org/scott-morris/gulp-json-refs.svg)](https://travis-ci.org/scott-morris/gulp-json-refs)
* Dependencies: [![Dependencies](https://david-dm.org/scott-morris/gulp-json-refs.svg)](https://david-dm.org/scott-morris/gulp-json-refs)
* Developer dependencies: [![Dev Dependencies](https://david-dm.org/scott-morris/gulp-json-refs/dev-status.svg)](https://david-dm.org/scott-morris/gulp-json-refs#info=devDependencies&view=table)
* Downloads: [![NPM Downloads Per Month](http://img.shields.io/npm/dm/gulp-json-refs.svg)](https://www.npmjs.org/package/gulp-json-refs)
* Gitter: [![Join the chat at https://gitter.im/scott-morris/gulp-json-refs](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/scott-morris/gulp-json-refs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
* License: [![License](http://img.shields.io/npm/l/gulp-json-refs.svg)](https://github.com/scott-morris/gulp-json-refs/blob/master/LICENSE)
* Version: [![NPM Version](http://img.shields.io/npm/v/gulp-json-refs.svg)](https://www.npmjs.org/package/gulp-json-refs)

Note that this is still in early (and heavy) development

## Why?

Let's say you have a number of files with multiple references that you'd like to resolve. This will get it done.

## Installation

Install package with NPM and add it to your development dependencies:

```bash
npm install --save-dev gulp-json-refs
```

## Usage

```javascript
var json_refs = require('gulp-json-refs');

gulp.task('resolveRefs', function() {
  return gulp.src('data/*.json')
    .pipe(json_refs())
    .pipe(gulp.dest('dist'));
});
```

[bower]: http://bower.io/
[npm]: https://www.npmjs.com/
[json-refs]: https://github.com/whitlockjc/json-refs
[json-reference-draft-spec]: http://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03
[json-pointer-spec]: http://tools.ietf.org/html/rfc6901
[path-loader]: https://github.com/whitlockjc/path-loader