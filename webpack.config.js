var path = require('path');
module.exports = {
  entry: './js/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'js'),
        loader: 'babel-loader'
      },
      {
        test: path.join(__dirname, 'css'),
        loader: 'style-loader!css-loader'
      }
    ]
  }
};
