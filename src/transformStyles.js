'use strict';

const uuid = require('node-uuid');

const {
  generateTransformedStylesFile
} = require('./transform/utils');

/**
 * transform the source into auto-prefixed css and save it to the target
 *
 * @param {string} hash
 * @param {boolean} minify
 * @param {Object} renderOptions
 * @param {string} source
 * @param {string} target
 * @returns {Promise}
 */
const transformStyles = ({
  hash = uuid.v4(),
  minify = true,
  renderOptions = {},
  source,
  target
}) => {
  if (!source) {
    throw new Error('source file location was not provided');
  }

  if (!target) {
    throw new Error('target file location was not provided');
  }

  return generateTransformedStylesFile(hash, minify, renderOptions, source, target);
};

module.exports = transformStyles;
