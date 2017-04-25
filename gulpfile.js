'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const apidoc = require('gulp-apidoc');

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
gulp.task('apidoc', function(done){
   apidoc({
      src: "routes/",
      dest: "doc/"
   }, done);
});

gulp.task('default', ['lint']);