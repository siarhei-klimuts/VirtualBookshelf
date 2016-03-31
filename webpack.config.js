require('dotenv').load();

var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
 
var webpack = require('webpack');
var url = require('url');
var path = require('path');

var NODE_MODULES = path.join(__dirname, '/node_modules/');
var BOWER_COMPONENTS = __dirname + '/bower_components/';
var LIBS_PATH = __dirname + '/src/libs/';

var isProd = process.env.NODE_ENV === 'production';
var NODE_HOST = process.env.NODE_HOST || 'http://127.0.0.1:3000';
var HOST_DEV = url.parse(process.env.HOST_DEV || 'http://127.0.0.1:8080');

var config = {
    watch: false,
    entry: {
        app: [path.resolve(__dirname, './src/js/index.js')],
        vendors: []
    },
    output: {
        pathinfo: true,
        path: path.join(__dirname, 'public'),
        filename: '/js/bundle.js'
    },
    module: {
        loaders: [
            {test: /\.js/, exclude: /(node_modules|bower_components|libs|lib3d)/, loader: 'ng-annotate!babel!jshint'},
            {test: /Detector.js/, loader: 'exports?Detector'},
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/, loader : 'file?name=fonts/[name].[ext]'}
        ],
        noParse: [],
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.join(NODE_MODULES, 'lib3d-objects/dist'),
            to: 'objects'
        }], {ignore: ['*.js', '*.map']}),
        new webpack.optimize.CommonsChunkPlugin('vendors', '/js/vendors.js')
    ],
    resolve: {
        root: path.join(__dirname, 'src'),
        alias: {}
    },

    addVendor: function (name, path) {
        if (path) {
            this.resolve.alias[name] = path;
        }

        this.module.noParse.push(new RegExp('^' + name + '$'));
        this.entry.vendors.push(name);
    }
};

if (isProd) {
    config.plugins.push(new CleanWebpackPlugin(['public/fonts', 'public/js', 'public/objects']));
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    config.devtool = 'source-map';
} else {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.entry.app.push('webpack/hot/dev-server');
    config.output.publicPath = HOST_DEV.href;
    config.devtool = 'eval';
    config.devServer = {
        publicPath: '/',
        contentBase: NODE_HOST,
        historyApiFallback: false,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        host: HOST_DEV.hostname,
        port: HOST_DEV.port,
        proxy: {
            '*': NODE_HOST
        }
    };
}

config.addVendor('angular');
config.addVendor('angular-block-ui', BOWER_COMPONENTS + 'angular-block-ui/dist/angular-block-ui.js');
config.addVendor('angular-block-ui.css', BOWER_COMPONENTS + 'angular-block-ui/dist/angular-block-ui.css');
config.addVendor('angular-growl-2', BOWER_COMPONENTS + 'angular-growl-2/build/angular-growl.js');
config.addVendor('angular-growl-2.css', BOWER_COMPONENTS + 'angular-growl-2/build/angular-growl.css');
config.addVendor('angular-utils-pagination', BOWER_COMPONENTS + 'angular-utils-pagination/dirPagination.js');
config.addVendor('ng-dialog');
config.addVendor('ng-dialog.css', NODE_MODULES + 'ng-dialog/css/ngDialog.css');
config.addVendor('lodash', BOWER_COMPONENTS + 'lodash/lodash.js');

config.addVendor('facebookSdk', LIBS_PATH + 'facebookSdk.js');
config.addVendor('googleAnalytics', LIBS_PATH + 'googleAnalytics.js');
config.addVendor('THREE', 'three');
config.addVendor('Detector', LIBS_PATH + 'three.js/Detector.js');

config.addVendor('lib3d');
config.addVendor('lib3d-objects');

config.addVendor('font-awesome', NODE_MODULES + 'font-awesome/css/font-awesome.css');

module.exports = config;