var webpack = require("webpack");

var NODE_MODULES = __dirname + '/node_modules/';
var BOWER_COMPONENTS = __dirname + '/bower_components/';
var LIBS_PATH = __dirname + '/src/libs/';

var isProd = process.env.NODE_ENV === 'production';

var config = {
    watch: false,
    entry: {
        app: [
            "webpack/hot/dev-server",
            './src/js/index.js'
        ],
        vendors: []
    },
    output: {
        pathinfo: true,
        path: __dirname + '/public',
        publicPath: 'http://localhost:8080/',
        filename: '/js/bundle.js'
    },
    module: {
        loaders: [
            {test: /\.js/, exclude: /(node_modules|bower_components|libs)/, loader: "ng-annotate!babel!jshint"},
            {test: /\.css$/, loader: "style!css?sourceMap"},
            {test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/, loader : 'file?name=fonts/[name].[ext]'}
        ],
        noParse: [],
    },
    plugins: [],
    resolve: {
        root: __dirname + '/src',
        alias: {}
    },
    devtool: isProd ? 'source-map' : 'eval',

    devServer: {
        publicPath: '/',
        contentBase: 'http://localhost:3000',
        historyApiFallback: false,
        hot: true,
        inline: true,
        progress: true,
        stats: 'errors-only',
        host: 'localhost',
        port: '8080',
        proxy: {
            "*": "http://localhost:3000"
        }
    },

    addVendor: function (name, path) {
        if (path) {
            this.resolve.alias[name] = path;
        }

        this.module.noParse.push(new RegExp('^' + name + '$'));
        this.entry.vendors.push(name);
    },
    addPlugin: function(plugin) {
        this.plugins.push(plugin)
    }
};

config.addPlugin(new webpack.optimize.CommonsChunkPlugin('vendors', '/js/vendors.js'));
if (isProd) {
    config.addPlugin(new webpack.optimize.UglifyJsPlugin({minimize: true}));
} else {
    config.addPlugin(new webpack.HotModuleReplacementPlugin());
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
config.addVendor('three');
config.addVendor('THREEx.WindowResize', LIBS_PATH + 'three.js/threex.windowresize.js');
config.addVendor('Detector', LIBS_PATH + 'three.js/Detector.js');

config.addVendor('font-awesome', NODE_MODULES + 'font-awesome/css/font-awesome.css');

module.exports = config;