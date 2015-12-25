var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var env = require('gulp-env');
var karma = require('gulp-karma');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var spawn = require('child_process').spawn;
var node;

var dest = {
	js: './public/js',
	css: './public/css'
};

var source = {
	bower: {
		js: [
			'./bower_components/**/*.min.js',
			'./bower_components/angular-utils-pagination/*.js',
			'./src/libs/**/*.js'
		],
		css: [
			'./bower_components/**/*.min.css',
			'!./bower_components/**/ngDialog-theme-*.min.css'
		]
	},
	app: {
		js: [
			'./src/js/app.js', 
			'./src/js/**/*.js'
		]
	},
	server: [
		'./app.js',
		'./models/**/*.js',
		'./routes/**/*.js',
		'./security/**/*.js'
	]
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
  	return gulp.src('./fooBar')
    .pipe(karma({
		configFile: 'karma.conf.js',
		action: 'run'
	}))
    .on('error', function(err) {
		throw err;
	});
});
 
gulp.task('testWatch', function() {
  	gulp.src('./fooBar')
    .pipe(karma({
		configFile: 'karma.conf.js',
		action: 'watch'
    }));
});

// TODO: remove as replaced by webpack
gulp.task('js', function() {
    gulp.src(source.app.js)
	.pipe(sourcemaps.init())
    .pipe(concat('index.js'))
	.pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js));
});

gulp.task('webpack:build-dev', function (callback) {
	webpack(webpackConfig, function (err, stats) {
		if (err) throw new gutil.PluginError('webpack:build-dev', err);
		gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));
        callback();
	});
});

gulp.task('watch', function () {
	gulp.watch('src/js/**/*.js', ['webpack:build-dev']);
});

gulp.task('watchServer', function () {
	gulp.watch(source.server, ['server']);
});

gulp.task('server', function() {
    if (node) node.kill();
    node = spawn('node', ['app.js'], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

gulp.task('set-env', function () {
    env({file: '.env.json'});
});

gulp.task('build', ['bowerjs', 'bowercss', 'webpack:build-dev']);
gulp.task('default', ['bowerjs', 'bowercss', 'set-env', 'webpack:build-dev', 'server', 'watchServer', 'watch']);

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
})