const gulp = require('gulp');
const webserver = require('gulp-webserver');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const runSequence = require('run-sequence');
const concatCss = require('gulp-concat-css');
const browserSync = require('browser-sync').create();
const imgmin = require('gulp-imagemin');
// const sass = require('gulp-sass');


var path = 'app';
var docs = 'docs';
var dist = 'dist';

gulp.task('js', function() {
  return gulp.src(path + '/js/main.js')
});

gulp.task('html', function() {
  gulp.src(path + '/**/*.html');
});

gulp.task('css', function() {
    gulp.src(path + '/css/*.css');
});

gulp.task('watch', function() {
    gulp.watch(path + '/js/**/*', ['js']);
    gulp.watch(path + '/css/**/*.css', ['css']);
    gulp.watch([path + '/**/*.html'], ['html']);
});

gulp.task('webserver', function() {
    gulp.src(docs + '/')
        .pipe(webserver({
            port: 3000,
            livereload: true,
            open: true
        }));
});

gulp.task('default', ['watch', 'html', 'js', 'css', 'webserver']);



//--build--//

gulp.task('copyAllHTML', function() {
    gulp.src(path + '/**/*.html')
        .pipe(gulp.dest(docs));
});
gulp.task('copyFavIcon', function() {
    gulp.src('favicon.jpg')
        .pipe(gulp.dest(docs));
});

gulp.task('minifyImages', () => {
    gulp.src(path + '/imgs/**/*')
    .pipe(imgmin())
    .pipe(gulp.dest(docs + '/imgs'));
});

gulp.task('processJS', function() {
    gulp.src(path + '/js/**/*.js')
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(gulp.dest((docs + '/js')))
});

gulp.task('sass2CSS', function() {
    return gulp.src(path + '/sass/**/*.scss')
                .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                .pipe(gulp.dest('src/css'))
                .pipe(browserSync.stream())
});

gulp.task('processCss', function() {
    return gulp.src(path + '/css/**/*.css')
                .pipe(concatCss('style.css'))
                .pipe(gulp.dest(docs + '/css'))
                .pipe(browserSync.stream())
});

gulp.task('build', function(callback) {
    runSequence(['copyAllHTML','copyFavIcon', 'processJS', 'minifyImages', 'processCss'], callback);
    // runSequence('sass2CSS', ['copyAllHTML', 'minifyImages', 'processJS', 'processCss'], callback);
});