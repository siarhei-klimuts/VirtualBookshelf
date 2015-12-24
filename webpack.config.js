var webpack = require("webpack");
var isProd = process.env.NODE_ENV === 'production';

module.exports = {
    entry: "./src/js/index.js",
    output: {
        path: __dirname + "/public",
        filename: "/js/bundle.js"
    },
    module: {
        loaders: [
            {test: /\.js/, exclude: /node_modules/, loader: "ng-annotate!babel!jshint"},
            {test: /\.css$/, loader: "style!css"},
            {test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/, loader : 'file?name=fonts/[name].[ext]'}
        ]
    },
    plugins: isProd ? [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ] : [],
    resolve: {
        root: __dirname + "/src"
    },
    devtool: isProd ? 'source-map' : 'eval'
};