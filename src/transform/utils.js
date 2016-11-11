const fs = require('fs');
const path = require('path');

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const less = require('less');
const NpmImportPlugin = require('less-plugin-npm-import');
const postcss = require('postcss');
const sass = require('node-sass');

const Core = require('css-modules-loader-core');
const camelCaser = require('./camelCaser').default;

const core = new Core([
  Core.localByDefault,
  Core.extractImports,
  camelCaser,
  Core.scope
]);

/**
 * replace the tilde-based url with the path to the node module
 *
 * @param {string} url
 * @returns {string}
 */
const resolveUrlPath = (url) => {
  if (url[0] !== '~') {
    return url;
  }

  return path.resolve(path.dirname(require.main.filename), 'node_modules', url.slice(1));
};

/**
 * save the transformed file to target
 *
 * @param {string} hash
 * @param {string} target
 * @returns {function({exportTokens: object, injectableSource: string}): Object}
 */
const saveFile = (hash, target) => {
  return ({exportTokens, injectableSource}) => {
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
  };
};

/**
 * load the prefixed CSS and convert via CSS Modules, then create a file with all metadata provided
 *
 * @param {string} hash
 * @param {string} target
 * @returns {function({css: string}): Promise}
 */
const applyCssModules = (hash, target) => {
  return ({css}) => {
    return core.load(css, hash)
      .catch((error) => {
        /* eslint-disable no-console */
        console.error('There was an error converting your file via CSS Modules.');
        /* eslint-enable */

        throw new Error(error);
      })
      .then(saveFile(hash, target));
  };
};

/**
 * get the CSS buffer from rendering the file
 *
 * @param {string} source
 * @param {Object} renderOptions
 * @returns {function(resolve: function): void}
 */
const getRenderedCss = (source, renderOptions) => {
  return (resolve) => {
    switch (path.extname(source).slice(1)) {
      case 'scss':
        const scssOptions = Object.assign({}, renderOptions, {
          file: source,
          importer(url) {
            return {
              file: resolveUrlPath(url)
            };
          }
        });

        // if the file is SCSS, use node-sass to compile into a Buffer
        const renderedFile = sass.renderSync(scssOptions);

        resolve(renderedFile.css);

        break;

      case 'less':
        // if the file is LESS, convert to string and render
        const fileString = fs.readFileSync(source, 'utf8');
        const lessOptions = Object.assign({}, renderOptions, {
          filename: source,
          plugins: [
            ...(renderOptions.plugins || []),
            new NpmImportPlugin({
              prefix: '~'
            })
          ]
        });

        less
          .render(fileString, lessOptions)
          .then(({css}) => {
            resolve(css);
          });

        break;

      default:
        // otherwise, assume the file is plain CSS and read the file as a Buffer
        resolve(fs.readFileSync(source, 'utf8'));

        break;
    }
  };
};

/**
 * get the prefixed css and apply the CSS modules
 *
 * @param {string} hash
 * @param {string} target
 * @param {boolean} minify
 * @returns {function(cssBuffer: Buffer): Promise}
 */
const getPrefixedCss = (hash, target, minify) => {
  return (cssBuffer) => {
    // convert the Buffer to a string and prefix via postcss
    const string = cssBuffer.toString('utf8');

    let prefixerPlugins = [
      autoprefixer({
        remove: false
      })
    ];

    if (minify) {
      prefixerPlugins = [
        ...prefixerPlugins,
        cssnano({
          safe: true
        })
      ];
    }

    return postcss(prefixerPlugins).process(string)
      .catch((error) => {
        /* eslint-disable no-console */
        console.error('There was an error prefixing your css.');
        /* eslint-enable */

        throw new Error(error);
      })
      .then(applyCssModules(hash, target));
  };
};

/**
 * generate the JS file with the appropriate prefixed
 * styles rendered and modularized
 *
 * @param {string} hash
 * @param {boolean} minify
 * @param {Object} renderOptions
 * @param {string} source
 * @param {string} target
 * @returns {Promise}
 */
const generateTransformedStylesFile = (hash, minify, renderOptions, source, target) => {
  return new Promise(getRenderedCss(source, renderOptions))
    .catch((error) => {
      /* eslint-disable no-console */
      console.error('There was a problem generating the CSS from your source file.');
      /* eslint-enable */

      throw new Error(error);
    })
    .then(getPrefixedCss(hash, target, minify));
};

module.exports = {
  applyCssModules,
  generateTransformedStylesFile,
  getPrefixedCss,
  getRenderedCss,
  resolveUrlPath,
  saveFile
};
