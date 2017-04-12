var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './example/index.js',
  output: {
    path: path.resolve(__dirname, 'example'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ["es2015", "react", "stage-0"]
        }
      }
    ]
  },
  devServer: {
    hot: false,
    contentBase: './example'
  },

  stats: {
    colors: true
  },
  devtool: 'source-map'
};