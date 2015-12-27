var gulp = require('gulp');
var env = require('gulp-env');
var karma = require('karma');
var gutil = require('gulp-util');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var spawn = require('child_process').spawn;
var node;

var source = {
	server: [
		'./app.js',
		'./models/**/*.js',
		'./routes/**/*.js',
		'./security/**/*.js'
	]
};

gulp.task('test', function(done) {
	new karma.Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});
 
gulp.task('testWatch', function() {
	new karma.Server({
		configFile: __dirname + '/karma.conf.js',
		autoWatch: true
	}, done).start();
});

gulp.task('webpack:build-dev', function (callback) {
	webpack(webpackConfig, function (err, stats) {
		if (err) throw new gutil.PluginError('webpack:build-dev', err);
		gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));
        // callback();
	});
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

gulp.task('build', ['webpack:build-dev']);
gulp.task('default', ['set-env', 'server', 'watchServer']);

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
})