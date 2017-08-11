// https://github.com/webpack/css-loader/issues/145
require('es6-promise').polyfill();

var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// WEBPACK_TARGET=lib webpack will build UMD library.
var lib = process.env.WEBPACK_TARGET === 'lib';
var optimize = process.env.WEBPACK_OPTIMIZE === 'true';

module.exports = {
  entry: lib ? './js/lib.js' : './js/main.jsx',
  output: {
    path: path.join(__dirname, lib ? 'dist-lib' : 'dist'),
    filename: lib ? 'grasp-seasons.js' : 'app.js',
    library: lib ? 'GRASPSeasons' : undefined,
    libraryTarget: lib ? 'umd' : undefined
  },
  devServer: { inline: true },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime' },
      { test: /\.css$/, exclude: /node_modules/, loader: 'style!css' },
      { test: /\.less$/, exclude: /node_modules/, loader: 'style!css!less' },
      // inline base64 URLs for <=2MB images, direct URLs for the rest.
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=2097152' }
    ]
  },
  plugins: []
};

if (!lib) {
  // We don't need .html page in our library.
  module.exports.plugins.push(new CopyWebpackPlugin([
    {from: 'public'}
  ]));
}

if (lib) {
  module.exports.externals = [
    {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  ]
}

if (optimize) {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
}
