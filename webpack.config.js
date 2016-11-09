'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
  cache: false,

  debug: true,

  devtool: '#source-map',

  entry: './src/index.js',

  eslint: {
    configFile: '.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: false,
    formatter: require('eslint-friendly-formatter')
  },

  externals: {
    react: {
      amd: 'react',
      commonjs2: 'react',
      commonjs: 'react',
      root: 'React'
    }
  },

  module: {
    preLoaders: [
      {
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'eslint',

        test: /\.(js|jsx)$/
      }
    ],

    loaders: [
      {
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel',
        test: /\.(js|jsx)$/
      }
    ]
  },

  output: {
    filename: 'react-scoped-css-injector.js',
    library: 'ReactScopedCssInjector',
    libraryTarget: 'umd',
    path: path.join(__dirname, 'dist')
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ])
  ],

  resolve: {
    extensions: [
      '',
      '.js'
    ],

    root: __dirname
  }
};
