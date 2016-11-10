'use strict';

const fs = require('fs');
const path = require('path');

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('postcss');
const sass = require('node-sass');
const uuid = require('node-uuid');

const Core = require('css-modules-loader-core');
const camelCaser = require('./transform/camelCaser').default;

const core = new Core([
  Core.localByDefault,
  Core.extractImports,
  camelCaser,
  Core.scope
]);

/**
 * transform the source into autoprefixed css and save it to the target
 *
 * @param {string} target
 * @param {string} hash
 * @param {string} source
 * @returns {Promise}
 */
const transformStyles = ({
  hash = uuid.v4(),
  minify = true,
  source,
  target
}) => {
  if (!source) {
    throw new Error('source file location was not provided');
  }

  if (!target) {
    throw new Error('target file location was not provided');
  }

  const sourceFileExtension = source.split('.').slice(-1)[0];

  let renderedFile;

  if (sourceFileExtension === 'scss') {
    // if the file is SCSS, use node-sass to compile into a Buffer
    renderedFile = sass.renderSync({
      file: source,
      importer(url) {
        if (url[0] === '~') {
          url = path.resolve(path.dirname(require.main.filename), 'node_modules', url.substring(1));
        }

        return {
          file: url
        };
      }
    }).css;
  } else {
    // otherwise, read the file as a Buffer
    renderedFile = fs.readFileSync(source, 'utf8');
  }

  // convert the Buffer to a string and prefix via postcss
  const string = renderedFile.toString('utf8');

  let prefixerPlugins = [
    autoprefixer({
      remove: false
    })
  ];

  if (minify) {
    prefixerPlugins = [
      ...prefixerPlugins,
      cssnano
    ];
  }

  const prefixer = postcss(prefixerPlugins);

  return prefixer.process(string)
    .then(({css}) => {
      // load the prefixed CSS and convert via CSS Modules, then create a file with all metadata provided
      return core.load(css, hash)
        .then(({exportTokens, injectableSource}) => {
          // provide the compiled CSS, the id to use in the style tag, and the selector map
          const fileValue = {
            css: injectableSource,
            id: `${hash}_Scoped_Styles`,
            selectors: exportTokens
          };

          // clean the string to mean the rapid7 ESLint config rules
          const bufferString = JSON.stringify(fileValue)
            .replace(/'/g, '\\\'')
            .replace(/"/g, '\'')
            .replace(/,/g, ', ');

          // make a Buffer of an exportable file
          const buffer = new Buffer(`module.exports = ${bufferString};\n`);

          // write the file to the target
          fs.writeFileSync(target, buffer);

          return fileValue;
        });
    });
};

module.exports = transformStyles;
