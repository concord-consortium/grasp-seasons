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
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'public' }
    ])
  ]
};
