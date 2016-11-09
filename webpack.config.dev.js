'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PORT = 3000;

module.exports = {
  cache: true,

  debug: true,

  devServer: {
    contentBase: './dist',
    inline: true,
    port: PORT,
    stats: {
      assets: false,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      timings: true,
      version: false
    }
  },

  devtool: '#cheap-module-eval-source-map',

  entry: './DEV_ONLY/App.js',

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: false,
    formatter: require('eslint-friendly-formatter')
  },

  module: {
    preLoaders: [
      {
        exclude: [
          path.resolve(__dirname, 'src', 'transformStyles.js')
        ],
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'DEV_ONLY', 'App.js')
        ],
        loader: 'eslint',
        test: /\.js$/
      }
    ],

    loaders: [
      {
        exclude: [
          path.resolve(__dirname, 'src', 'transformStyles.js')
        ],
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'DEV_ONLY', 'App.js')
        ],
        loader: 'babel',
        query: {
          plugins: [
            'transform-decorators-legacy'
          ]
        },
        test: /\.js$/
      }
    ]
  },

  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'dist'),
    publicPath: `http://localhost:${PORT}/`
  },

  plugins: [
    new webpack.EnvironmentPlugin([
        'NODE_ENV'
    ]),
    new HtmlWebpackPlugin()
  ],

  postcss: function() {
    return [
      autoprefixer
    ];
  },

  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx'
    ],

    root: __dirname
  }
};
