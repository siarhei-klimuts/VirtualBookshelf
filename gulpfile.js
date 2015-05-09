var gulp = require('gulp');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var env = require('gulp-env');
var karma = require('gulp-karma');

var dest = {
	js: './public/js',
	css: './public/css'
};

var source = {
	bower: {
		js: [
			'./bower_components/**/*.min.js',
			'./bower_components/angular-utils-pagination/*.js',
			'./src/js/libs/**/*.js'
		],
		css: [
			'./bower_components/**/*.min.css',
			'!./bower_components/**/ngDialog-theme-*.min.css'
		]
	},
	app: {
		js: [
			'./src/js/app.js', 
			'./src/js/**/*.js',
			'!./src/js/libs/**/*.js'
		]
	}
};

gulp.task('bowerjs', function() {
	return gulp.src(source.bower.js)
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(concat('vendor.js'))
    	.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest.js));
});

gulp.task('bowercss', function() {
	return gulp.src(source.bower.css)
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest(dest.css));
});

gulp.task('test', function() {
  	return gulp.src('./fooBar').pipe(karma({
		configFile: 'karma.conf.js',
		action: 'run'
	})).on('error', function(err) {
		throw err;
	});
});
 
gulp.task('testWatch', function() {
  	gulp.src('./fooBar').pipe(karma({
		configFile: 'karma.conf.js',
		action: 'watch'
    }));
});

gulp.task('js', function() {
    gulp.src(source.app.js)
	.pipe(sourcemaps.init())
    .pipe(concat('index.js'))
	.pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js));
});

gulp.task('watch', function () {
	gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('demon', function () {
	nodemon({
		script: 'app.js',
		ext: 'js',
		ignore: ['./src', './public', './views', './test']
	});
});

gulp.task('set-env', function () {
    env({file: '.env.json'});
});

gulp.task('default', ['bowerjs', 'bowercss', 'js', 'set-env', 'watch', 'demon', 'testWatch']);