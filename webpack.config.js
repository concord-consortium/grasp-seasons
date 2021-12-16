var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// WEBPACK_TARGET=lib webpack will build UMD library.
var lib = process.env.WEBPACK_TARGET === 'lib';

module.exports = {
  entry: lib ? './js/lib.ts' : './js/main.tsx',
  output: {
    path: path.join(__dirname, lib ? 'dist-lib' : 'dist'),
    filename: lib ? 'grasp-seasons.js' : 'app.js',
    library: lib ? 'GRASPSeasons' : undefined,
    libraryTarget: lib ? 'umd' : undefined
  },
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  mode: 'development',
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'css-loader',
          options: {
            esModule: false
          }
        }]
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader', // translates CSS into CommonJS
          options: {
            esModule: false
          }
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      },
      {
        test: /\.(scss)$/,
        use: [{
          loader: 'style-loader', // inject CSS to page
        }, {
          loader: 'css-loader', // translates CSS into CommonJS modules
          options: {
            esModule: false
          }
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            postcssOptions: {
              plugins: [
                'autoprefixer'
              ]
            }
          }
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset',
        // inline base64 URLs for <=4000k images, direct URLs for the rest
        parser: {
          dataUrlCondition: {
            maxSize: 4096000
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'public' }]
    })
  ]
};
