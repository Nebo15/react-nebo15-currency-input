const path = require('path');
const env = require('yargs').argv.mode;

const genConfig = {
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
          presets: ['es2015', 'react', 'stage-0'],
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};

let config = {};

if (env === 'dev') {
  config = Object.assign({
    devServer: {
      hot: false,
      contentBase: './example'
    },
  }, genConfig);
} else {
  config = genConfig;
}

module.exports = config;
