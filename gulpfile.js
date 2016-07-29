var gulp = require('gulp'),
  less = require('gulp-less'),
  browserSync = require('browser-sync').create(),
  pug = require('gulp-pug'),
  plumber = require('gulp-plumber'),
  watch = require('gulp-watch'),
  uglify = require('gulp-uglify'),
  cssnano = require('gulp-cssnano'),  
  concat = require('gulp-concat'),
  order = require('gulp-order'),
  src = './';

var mainBowerFiles = require('main-bower-files');

  var LessPluginAutoPrefix = require('less-plugin-autoprefix');

var autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });
  
gulp.task('compile-less', function(){
  gulp.src(['./app/src/less/spectre.less', './app/src/less/main.less'])
    .pipe(plumber())
    .pipe(less({
            plugins: [autoprefix]
        }))    
	.pipe(cssnano())
	.pipe(concat('all.css'))
    .pipe(gulp.dest('app/dist/css'));
});

gulp.task('compile-js', function(){
  gulp.src('./app/src/js/*.js')
    .pipe(plumber())
	.pipe(order(['**/_App.js', '**/App.*.js']))
	.pipe(uglify())
	.pipe(concat('all.js', {newLine: ';'}))
    .pipe(gulp.dest('app/dist/js'));
});

gulp.task('js-dependencies', function() {
    return gulp.src(mainBowerFiles())
		.pipe(plumber())
		.pipe(uglify())
		.pipe(concat('deps.js'))
        .pipe(gulp.dest('app/dist/js'))
});

gulp.task('compile-pug', function buildHTML() {
  return gulp.src(src + 'app/src/pug/content/**/*.pug')
  .pipe(plumber())
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest(src + 'app/dist'));
});

gulp.task('browser-refresh', function() {
    browserSync.reload({stream: true});
});

gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: src + 'app/dist'
    }
  });
  gulp.watch('app/src/less/**/*.less', {cwd: src}, ['compile-less', 'browser-refresh']);
  gulp.watch('app/src/pug/**/*.pug', {cwd: src}, ['compile-pug', 'browser-refresh']);
  gulp.watch('app/src/js/**/*.js', {cwd: src}, ['compile-js', 'browser-refresh']);
});

gulp.task('default', ['compile-less', 'compile-pug', 'compile-js', 'js-dependencies']);
