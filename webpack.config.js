/* eslint-env node */
require('dotenv').config();
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const buildDir = `${__dirname}/build`;

module.exports = {
  // our starting point for our javascript
  entry: './src/index.js',
  // what do we call the output? where to put it?
  output: {
    filename: 'bundle.[hash].js',
    // this path is for npm run build
    path: buildDir
  },
  // gives us source maps
  devtool: 'inline-source-map',
  // these add high-level functionality to webpack
  plugins: [
    // clean part or all of directory before new build
    new CleanWebpackPlugin(buildDir),
    // pass dev environment variables into built app
    new webpack.DefinePlugin({
      'process.env.KEY_TO_ADD': JSON.stringify(process.env.KEY_TO_ADD)
    }),
    // create an index.html based on our template
    new HtmlPlugin({ template: './src/index.html' })
  ],
  module: {
    // rules tell webpack how to require or import things
    rules: [
      {
        // if the file ends in .js and is not in node_modules
        // load it with babel loader
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          // dynamically puts CSS into style tag of document head
          {
            loader: 'style-loader',
            options: { sourceMap: true }
          },
          // turns CSS into JS that exports a CSS string
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
          // allows us to write nested CSS and auto-prefix
          // CSS props
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          }
        ]
      },
      // load images!
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'url-loader',
          // if file is bigger than limit, create a 'real' file
          // otherwise default to base64 encoding
          options: {
            limit: 5000
          }
        }
      }
    ]
  }
};