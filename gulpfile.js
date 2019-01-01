var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean-css');
var server = require('gulp-webserver');
var url = require('url');
var path = require('path');
var fs = require('fs');
var data = require('./data.json');
var babel = require('gulp-babel');

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(clean())
        .pipe(gulp.dest('/src/css'));
});

gulp.task('watch', function() {
    return gulp.watch('/src/scss/*.scss', gulp.series('sass'));
});

gulp.task('server', function() {
    return gulp.src('./src/')
        .pipe(server({
            port: '8024',
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname == '/favicon.ico') {
                    return res.end("");
                }
                if (pathname == '/') {
                    res.end(fs.readFileSync(path.join(__dirname, 'src/index.html')));
                } else if (pathname == '/list') {
                    res.end(JSON.stringify({
                        data: data
                    }));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
});

gulp.task('dev', gulp.series('sass', 'server', 'watch'));

gulp.task('cssmin', function() {
    return gulp.src('./src/css/*.css')
        .pipe(gulp.dest('./build/css'));
});

gulp.task('jsmin', function() {
    return gulp.src('./src/js/*.js')
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('babel', function() {
    return gulp.src('./src/js/index.js')
        .pipe(babel({
            presets: 'es2015'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('build', gulp.series('babel', 'jsmin', 'cssmin'));