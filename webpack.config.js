var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// DEPLOY_PATH is set by the s3-deploy-action its value will be:
// `branch/[branch-name]/` or `version/[tag-name]/`
// See the following documentation for more detail:
// https://github.com/concord-consortium/s3-deploy-action/blob/main/README.md#top-branch-example
const DEPLOY_PATH = process.env.DEPLOY_PATH;

// WEBPACK_TARGET=lib webpack will build UMD library.
var lib = process.env.WEBPACK_TARGET === 'lib';

module.exports = {
  entry: lib ? './src/lib.ts' : './src/index.tsx',
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
          loader: 'style-loader', // inject CSS to page
        }, {
          loader: 'css-loader',
          options: {
            esModule: false
          }
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
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      publicPath: '.',
    }),
    ...(DEPLOY_PATH ? [new HtmlWebpackPlugin({
      filename: 'index-top.html',
      template: 'src/index.html',
      favicon: 'src/public/favicon.ico',
      publicPath: DEPLOY_PATH
    })] : []),
  ]
};
