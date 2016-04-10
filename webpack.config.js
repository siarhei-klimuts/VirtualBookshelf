require('dotenv').config({silent: true});

var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpack = require('webpack');
var url = require('url');
var path = require('path');

var NODE_MODULES = path.join(__dirname, '/node_modules/');
var LIBS_PATH = __dirname + '/src/libs/';

var isProd = process.env.NODE_ENV === 'build';
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
        filename: "/js/[name].js",
        chunkFilename: "/js/[id].js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
            {test: /\.js$/, exclude: /(node_modules|libs|lib3d)/, loader: 'ng-annotate!babel!jshint'},
            {test: /Detector.js/, loader: 'exports?Detector'},
            {test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/, loader : 'url?name=fonts/[name].[ext]'},
            {test: /\.json/, loader: 'json'}
        ],
        noParse: [],
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.join(NODE_MODULES, 'lib3d-objects/dist'),
            to: 'objects'
        }], {ignore: ['*.js', '*.map']}),
        new webpack.optimize.CommonsChunkPlugin('vendors', '/js/vendors.js'),
        new ExtractTextPlugin('css/[name].css')
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
    config.plugins.push(new CleanWebpackPlugin(['public/fonts', 'public/js', 'public/css', 'public/objects']));
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
config.addVendor('angular-block-ui');
config.addVendor('angular-block-ui.css', path.join(NODE_MODULES, 'angular-block-ui/dist/angular-block-ui.css'));
config.addVendor('angular-growl-v2');
config.addVendor('angular-growl-v2.css', path.join(NODE_MODULES, 'angular-growl-v2/build/angular-growl.css'));
config.addVendor('angular-utils-pagination');

config.addVendor('ng-dialog');
config.addVendor('ng-dialog.css', path.join(NODE_MODULES, 'ng-dialog/css/ngDialog.css'));
config.addVendor('ngDialog-theme-default.css', path.join(NODE_MODULES, 'ng-dialog/css/ngDialog-theme-default.css'));

config.addVendor('facebookSdk', path.join(LIBS_PATH, 'facebookSdk.js'));
config.addVendor('VK', path.join(LIBS_PATH, 'openapi.js'));
config.addVendor('twitter', path.join(LIBS_PATH, 'widgets.js'));
config.addVendor('googleAnalytics', path.join(LIBS_PATH, 'googleAnalytics.js'));
config.addVendor('Detector', path.join(LIBS_PATH, 'three.js/Detector.js'));

config.addVendor('lib3d');
config.addVendor('lib3d-objects');

config.addVendor('font-awesome', path.join(NODE_MODULES, 'font-awesome/css/font-awesome.css'));

module.exports = config;