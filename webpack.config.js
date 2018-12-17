// https://github.com/webpack/css-loader/issues/145
require('es6-promise').polyfill();

var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// WEBPACK_TARGET=lib webpack will build UMD library.
var lib = process.env.WEBPACK_TARGET === 'lib';

module.exports = {
  entry: lib ? './js/lib.js' : './js/main.jsx',
  output: {
    path: path.join(__dirname, lib ? 'dist-lib' : 'dist'),
    filename: lib ? 'grasp-seasons.js' : 'app.js',
    library: lib ? 'GRASPSeasons' : undefined,
    libraryTarget: lib ? 'umd' : undefined
  },
  devServer: { inline: true },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        // Pass global THREE variable to OrbitControls
        test: /three\/examples\/js/,
        loader: 'imports-loader?THREE=three'
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: {
          loader: 'json-loader'
        }
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'css-loader'
        }]
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        // inline base64 URLs for <=4000k images, direct URLs for the rest
        use: [{
          loader: 'url-loader?limit=4096000'
        }]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'public' }
    ])
  ]
};
