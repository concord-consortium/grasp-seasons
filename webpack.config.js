// https://github.com/webpack/css-loader/issues/145
require('es6-promise').polyfill();

var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var lib = process.env.WEBPACK_TARGET === 'lib';

module.exports = {
  entry: lib ? './js/lib.js' : './js/main.jsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: lib ? 'grasp-seasons.js' : 'app.js',
    library: lib ? 'GRASPSeasons' : undefined,
    libraryTarget: lib ? 'umd' : undefined
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime' },
      { test: /\.css$/, exclude: /node_modules/, loader: 'style!css' },
      { test: /\.less$/, exclude: /node_modules/, loader: 'style!css!less' },
      // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192' }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'public' }
    ])
  ]
};
