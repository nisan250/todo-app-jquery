const gulp = require('gulp');
const inject = require('gulp-inject');
const webserver = require('gulp-webserver');
const htmlclean = require('gulp-htmlclean');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imgmin = require('gulp-imagemin');
const print = require('gulp-print').default;
const del = require('del');
// // const sass = require('gulp-sass');
// const runSequence = require('run-sequence');
// const concatCss = require('gulp-concat-css');
// const browserSync = require('browser-sync').create();

// var order = require('gulp-order');

const paths = {
  app: 'app/**/*',
  appHTML: 'app/**/*.html',
  appCSS: 'app/**/*.css',
  appJS: 'app/**/*.js',
  appJSON: 'app/**/*.json',
  appImgs: 'app/imgs/**/*',
  tmp: 'tmp',
  tmpIndex: 'tmp/index.html',
  tmpCSS: 'tmp/**/*.css',
  tmpJS: 'tmp/**/*.js',
  tmpJSON: 'tmp/**/*.json',
  tmpImgs: 'tmp/imgs/**/*',
  dist: 'dist',
  distIndex: 'dist/index.html',
  distCSS: 'dist/**/*.css',
  distJS: 'dist/**/*.js',
  distImgs: 'dist/imgs/**/*',
  distJSON: 'dist/**/*.json',
};

/*  --- TEMP - WORK ENV ---   */
gulp.task('html', function () {
    return gulp.src(paths.appHTML).pipe(gulp.dest(paths.tmp));
});
gulp.task('css', function () {
    return gulp.src(paths.appCSS).pipe(gulp.dest(paths.tmp));
});
gulp.task('js', function () {
    return gulp.src(paths.appJS)
    .pipe(gulp.dest(paths.tmp));
});
gulp.task('json', function () {
    return gulp.src(paths.appJSON)
    .pipe(gulp.dest(paths.tmp));
});
gulp.task('favIcon', function() {
    gulp.src('favicon.jpg').pipe(gulp.dest(paths.tmp));
    
});
gulp.task('images', () => {
    gulp.src(paths.appImgs).pipe(imgmin()).pipe(gulp.dest('tmp/imgs'));
});
gulp.task('copy', ['html', 'favIcon',  'css', 'js', 'json', 'images']);

gulp.task('inject', ['copy'], function () {
    const css = gulp.src(paths.tmpCSS);
    const js = gulp.src(
        [
            paths.app + '/js/lib/fontawesome-all.min.js',
            paths.app + '/js/lib/jquery.min.js',
            paths.app + '/js/lib/jquery.loadTemplate.min.js',
            paths.app + '/js/lib/jquery-dateFormat.min.js',
            paths.app + '/js/lib/popper.min.js',
            paths.app + '/js/lib//bootstrap.min.js',
            paths.app + '/js/lib/underscore-min.js',
            paths.app + '/js/script.js',
            // 'app/**/*.js'
        ]
    );
    return gulp.src(paths.tmpIndex)
      .pipe(inject( css, { relative:true } ))
      .pipe(inject( js, { relative:true } ))
      .pipe(gulp.dest(paths.tmp));
  });

gulp.task('serve', ['inject'], function () {
    return gulp.src(paths.tmp)
        .pipe(webserver({
        port: 3000,
        livereload: true
        }));
});

gulp.task('watch', ['serve'], function () {
    gulp.watch(paths.app, ['inject']);
});

gulp.task('default', ['watch']);


/*  --- PRODUCTION - PROD ENV ---   */
gulp.task('html:dist', function () {
    return gulp.src(paths.appHTML)
      .pipe(htmlclean())
      .pipe(gulp.dest(paths.dist));
  });

gulp.task('css:dist', function () {
return gulp.src(paths.appCSS)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('js:dist', function () {
    // return gulp.src(paths.appJS)
    return gulp.src(
        [
            paths.tmp + '/js/lib/fontawesome-all.min.js',
            paths.tmp + '/js/lib/jquery.min.js',
            paths.tmp + '/js/lib/jquery.loadTemplate.min.js',
            paths.tmp + '/js/lib/jquery-dateFormat.min.js',
            paths.tmp + '/js/lib/popper.min.js',
            paths.tmp + '/js/lib//bootstrap.min.js',
            paths.tmp + '/js/lib/underscore-min.js',
            paths.tmp + '/js/script.js',
        ]
    ).pipe(print())
    .pipe(concat('script.min.js'))
    // .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('json:dist', function () {
    return gulp.src(paths.tmpJSON)
    .pipe(gulp.dest(paths.dist));
});

gulp.task('images:dist', () => {
    gulp.src(paths.tmpImgs).pipe(imgmin()).pipe(gulp.dest('dist/imgs'));
});

gulp.task('favIcon:dist', function() {
    gulp.src('favicon.jpg').pipe(gulp.dest(paths.dist));
    
});

gulp.task('copy:dist', ['images:dist', 'html:dist', 'css:dist', 'js:dist', 'favIcon:dist', 'json:dist' ]);

gulp.task('inject:dist', ['copy:dist'], function () {
    const css = gulp.src(paths.distCSS);
    const js = gulp.src(paths.distJS).pipe(print());

    return gulp.src(paths.distIndex)
        .pipe(inject( css, { relative:true } ))
        .pipe(inject( js, { relative:true } ))
        .pipe(gulp.dest(paths.dist));
    });
    
gulp.task('build', ['inject:dist']);




/*---*/
gulp.task('serve-dist', ['inject'], function () {
    return gulp.src(paths.dist)
        .pipe(webserver({
        port: 3000,
        livereload: true
        }));
});
gulp.task('clean', function () {
    del([paths.tmp, paths.dist]);
});
gulp.task('docs', function () {
    return gulp.src('dist/**/*').pipe(gulp.dest('docs'));
});

