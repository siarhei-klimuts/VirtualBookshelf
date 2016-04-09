var webpackConfig = require('./webpack.config.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],
    files: [
        'public/js/vendors.js',
        'src/js/index.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'test/client/**/*.js'
    ],
    preprocessors: {
        'src/js/index.js': ['webpack'],
        'test/client/**/*.js': ['webpack']
    },
    webpack: {
      devtool: 'inline-source-map',
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      plugins: [new ExtractTextPlugin('css/[name].css')]
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
