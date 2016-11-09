'use strict';

const fs = require('fs');
const path = require('path');

const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const sass = require('node-sass');
const uuid = require('node-uuid');

const Core = require('css-modules-loader-core');
const camelCase = require('postcss-camel-case');

const core = new Core([
  Core.localByDefault,
  Core.extractImports,
  camelCase,
  Core.scope
]);

const prefixer = postcss([
  autoprefixer({
    remove: false
  })
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
  const sourceFileExtension = source.split('.').slice(-1)[0];

  let renderedFile;

  if (sourceFileExtension === 'scss') {
    // if the file is SCSS, use node-sass to compile into a Buffer
    renderedFile = sass.renderSync({
      file: source,
      importer(url) {
        if (url[0] === '~') {
          url = path.resolve(__dirname, 'node_modules', url.substring(1));
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
  const prefixedString = prefixer.process(string).css;

  // load the prefixed CSS and convert via CSS Modules, then create a file with all metadata provided
  return core.load(prefixedString, hash)
    .then(({exportTokens, injectableSource}) => {
      let css = injectableSource.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '');

      if (minify) {
        css = css
          .replace(/ {2,}/g, ' ')
          .replace(/ ([{:}]) /g, '$1')
          .replace(/([;,]) /g, '$1')
          .replace(/ !/g, '!');
      }

      // provide the compiled CSS, the id to use in the style tag, and the selector map
      const fileValue = {
        css,
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
};

module.exports = transformStyles;
