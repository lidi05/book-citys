var gulp = require('gulp');
var less = require('gulp-less');
var squence = require('gulp-sequence');
var server = require('gulp-webserver');
var mock = require("./src/data/mock.js");
var url = require('url');
var clean = require("gulp-clean-css"); //css
var uglify = require("gulp-uglify"); //js
var minhtml = require("gulp-htmlmin"); //html
//js
gulp.task('uglify', function() {
    gulp.src(['./src/js/{common/,lib/,page/}/*.js', './src/js/main.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});
//html
gulp.task('minhtmls', function() {
    gulp.src('./src/*.html')
        .pipe(minhtml())
        .pipe(gulp.dest('./dist/'))
});

//css
gulp.task('mincss', function() {
    gulp.src('./src/css/*.css')
        .pipe(clean())
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('testless', function() {
    gulp.src('./src/css/*.less')
        .pipe(less())
        .pipe(gulp.dest("dist/css"))
});

gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            port: 8008,
            host: "localhost",
            livereload: true,
            // open: true,
            middleware: function(req, res, next) {
                var uname = url.parse(req.url, true);
                if (/\/book/g.test(uname.pathname)) {
                    res.end(JSON.stringify(mock(req.url)))
                }
                next();
            }
        }))
});
gulp.task('default', function(cd) {
    squence("minhtmls", "mincss", "uglify", "testless", "server", cd)
})