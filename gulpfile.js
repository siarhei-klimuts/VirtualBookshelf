var gulp = require('gulp');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var env = require('gulp-env');

gulp.task('js', function() {
    gulp.src(['./src/js/app.js', './src/js/**/*.js'])
    	.pipe(sourcemaps.init())
        .pipe(concat('index.js'))
    	.pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/js'))
});

gulp.task('watch', function () {
	gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('demon', function () {
	nodemon({
		script: 'app.js',
		ext: 'js',
		ignore: ['./src', './public', './views']
	})
});

gulp.task('set-env', function () {
    env({file: ".env.json"});
});

gulp.task('default', ['js', 'set-env', 'watch', 'demon']);