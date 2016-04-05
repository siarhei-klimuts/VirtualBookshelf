var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};
webpackConfig.plugins = [];

module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],
    files: [
        'public/js/vendors.js',
        'src/js/index.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'test/lib/karma-read-json.js',
        'test/client/**/*.js'
    ],
    preprocessors: {
        'src/js/index.js': ['webpack'],
        'test/client/**/*.js': ['webpack']
    },
    webpack: {
      devtool: 'inline-source-map',
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
