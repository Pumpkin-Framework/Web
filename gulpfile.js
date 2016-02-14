var gulp = require('gulp');
var uglify = require('gulp-uglify');
var through2 = require('through2');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var runSeq = require('run-sequence');
var rsync = require('gulp-rsync');

// Stylus includes
var nib = require('nib');
var jeet = require('jeet');

// Error handling
var handleError = function (error) {
    gutil.log(error.message);
    this.emit('end');
};

// Stylus build configuration
var styl = function () {
    return stylus({
        use: [
            nib(),
            jeet()
        ]
    });
};

// Cleans the build directory
gulp.task('clean', function (cb) {
    del([
        './build/'
    ], cb);
});

// Copies html files
gulp.task('copy:html', function () {
    return gulp.src(['./src/html/**/*'])
        .pipe(gulp.dest('./build/'))
});

// Copies static files
gulp.task('copy:static', function () {
    return gulp.src(['./src/static/**/*'])
        .pipe(gulp.dest('./build/static/'))
});

// Compiles and minifies stylus files
gulp.task('build:styl', function () {
    return gulp.src(['./src/styl/index.styl'])
        .pipe(styl())
        .pipe(rename("pumpkin.css"))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/static/'));
});

// Compiles and minifies typescript files
gulp.task('build:ts', function () {
    return gulp.src(['./src/ts/**/*.ts'])
        .pipe(ts({out: 'pumpkin.js'}))
        //.pipe(uglify())
        .pipe(gulp.dest('./build/static'));
});

// Performs build
gulp.task('build', function (cb) {
    runSeq(
        'clean',
        ['copy:html', 'copy:static', 'build:ts', 'build:styl'],
        cb
    );
});

// Compiles stylus with sourcemaps
gulp.task('build:styl-dev', function () {
    return gulp.src('./src/styl/index.styl')
        .pipe(sourcemaps.init())
        .pipe(styl())
        .on('error', handleError)
        .pipe(sourcemaps.write())
        .pipe(rename('pumpkin.css'))
        .pipe(gulp.dest('./build/static/'));
});

// Compiles typescript with sourcemaps
gulp.task('build:ts-dev', function () {
    return gulp.src(['./src/ts/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts({out: 'pumpkin.js'}))
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/static'));
});

gulp.task('deploy', function() {
    return gulp.src(['./build/**/*'])
        .pipe(rsync({
            destination: '/var/www/pumpkin.jk-5.nl',
            root: './build/',
            hostname: '10.2.1.2',
            username: 'root',
            incremental: true,
            progress: false,
            relative: true,
            emptyDirectories: true,
            recursive: true,
            clean: true,
            silent: true,  //This fixes a crash when gulp's log is redirected to a file
            exclude: ['.DS_Store']
        }));
});

gulp.task('build-dev', function(cb){
    runSeq(
        ['copy:html', 'copy:static', 'build:styl-dev', 'build:ts-dev'],
        'deploy',
        cb
    );
});

// Rebuild when files are changed
gulp.task('dev', ['build-dev'], function () {
    gulp.watch('./src/**/*', ['build-dev']);
});

// Make dev the default task
gulp.task('default', ['dev']);
