'use strict';

const gulp = require('gulp');
const jshint = require('gulp-jshint');

/**
* Lint Checker
*/
gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint())
})

gulp.task('default', ['lint']);