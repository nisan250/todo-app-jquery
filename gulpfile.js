const gulp = require('gulp');
const webserver = require('gulp-webserver');
const runSequence = require('run-sequence');
const concatCss = require('gulp-concat-css');
const browserSync = require('browser-sync').create();

var builds = 'app';

gulp.task('js', function() {
  return gulp.src(builds + '/js/main.js')
});

gulp.task('html', function() {
  gulp.src(builds + '/**/*.html');
});

gulp.task('css', function() {
    gulp.src(builds + '/css/*.css');
});

gulp.task('watch', function() {
    gulp.watch(builds + '/js/**/*', ['js']);
    gulp.watch(builds + '/css/**/*.css', ['css']);
    gulp.watch([builds + '/**/*.html'], ['html']);
});

gulp.task('webserver', function() {
    gulp.src(builds + '/')
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
        .pipe(gulp.dest('dist'));
});

gulp.task('minifyImages', () => {
    gulp.src(path + '/imgs/**/*')
    .pipe(imgmin())
    .pipe(gulp.dest('dist/imgs'));
});

gulp.task('processJS', function() {
    gulp.src(path + '/js/**/*.js')
    .pipe(uglify())
    .pipe(concat('application.js'))
    .pipe(gulp.dest(('dist/js')))
});
// .pipe(browserSync.stream()) - insurers browser always running the current css when 
gulp.task('sass2CSS', function() {
    return gulp.src(path + '/sass/**/*.scss')
                .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                .pipe(gulp.dest('src/css'))
                .pipe(browserSync.stream())
});

gulp.task('processCss', function() {
    return gulp.src(path + '/css/**/*.css')
                .pipe(concatCss('styles.css'))
                .pipe(gulp.dest('dist/css'))
                .pipe(browserSync.stream())
});

gulp.task('build', function(callback) {
    runSequence(['copyAllHTML', 'processJS', 'processCss'], callback);
    // runSequence('sass2CSS', ['copyAllHTML', 'minifyImages', 'processJS', 'processCss'], callback);
});