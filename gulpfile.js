const gulp = require('gulp');  
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');  
const merge = require('merge-stream');
const pug = require('gulp-pug');
const cssnano = require('gulp-cssnano');

const serve = require('browser-sync').create();

const src = './app/src/';
const dist = './app/dist/';

const modules = [ 'bos5tone', 'dtmf' ];

gulp.task('js', function(){
	tasks = modules.map(function(name){
		return gulp.src([src + 'js/*.js', src + 'js/' + name + '/*.js'])
			.pipe(uglify())
			.pipe(concat('signaling.js', {newLine: '\r\n\r\n'}))
			.pipe(gulp.dest(dist + name));			
	});
	
	return merge(tasks);
});

gulp.task('pug', function(){
	tasks = modules.map(function(name){
		return gulp.src(src + 'pug/' + name + '/*.pug')
			.pipe(pug())			
			.pipe(gulp.dest(dist + name));			
	});
	
	return merge(tasks);
});

gulp.task('css', function(){
	tasks = modules.map(function(name){
		return gulp.src(src + 'css/*.css')
			.pipe(concat('signaling.css', {newLine: '\r\n\r\n'}))			
			.pipe(cssnano())
			.pipe(gulp.dest(dist + name))			
			.pipe(gulp.dest(dist));					
	});
	
	return merge(tasks);
});

gulp.task('index', function(){
	return gulp.src(src + 'pug/index.pug')
		.pipe(pug())			
		.pipe(gulp.dest(dist));			
});

gulp.task('refresh', function() {
    serve.reload({
		stream: true
	});
});

gulp.task('watch', function() {
  serve.init({
    server: {
      baseDir: dist
    },
	open: false,
	ui: false
  });
  
  gulp.watch('pug/**/*.pug', {cwd: src}, ['index', 'pug', 'refresh']);
  gulp.watch('js/**/*.js', {cwd: src}, ['js', 'refresh']);
  gulp.watch('css/**/*.css', {cwd: src}, ['css', 'refresh']);
});

gulp.task('default', ['index', 'pug', 'js', 'css']);