'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const apidoc = require('gulp-apidoc');
const mocha = require('gulp-mocha');

/**
* Lint Checker
*/
gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})

/**
* Run Mocha Tests
*/
gulp.task('mocha', () =>
  gulp.src('test/*.js', {read: false})
    .pipe(mocha({reporter: 'spec'}))
);

/**
* Run documentation generator
*/
gulp.task('apidoc', function(done){
   apidoc({
      src: "routes/",
      dest: "doc/"
   }, done);
});

gulp.task('default', ['lint', 'mocha', 'apidoc']);