'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
var jsdoc = require('gulp-jsdoc3');

/**
* Lint Checker
*/
gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})

/** 
 * Run documentation generator
 */
/*gulp.task('apidoc', function(done) {
  apidoc({
    src: "public/javascript",
    dest: "doc/"
  }, done);
});*/

gulp.task('doc', function (cb) {
    gulp.src(['README.md', './public/javascript/*.js'], {read: false})
            .pipe(jsdoc(cb));
});

gulp.task('default', ['lint', 'doc']);
