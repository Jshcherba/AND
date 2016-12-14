var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    embedlr = require('gulp-embedlr');

gulp.task('lint', function() {
    gulp.src('./app/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('browserify', function() {
    gulp.src(['app/scripts/main.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('watch', ['lint', 'sass'], function() {
    gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
        'lint',
        'browserify'
    ]);
    gulp.watch('./app/styles/**/*.scss', ['sass']);
    gulp.watch(['app/index.html', 'app/views/**/*.html'], ['views']);
});

gulp.task('views', function() {
    gulp.src('app/index.html').pipe(gulp.dest('dist/'));
    gulp.src('./app/views/**/*')
        .pipe(gulp.dest('dist/views/'));
});

gulp.task('sass', function () {
    gulp.src('app/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/public/styles'));
});

gulp.task('dev', function() {
    gulp.start('watch');
});