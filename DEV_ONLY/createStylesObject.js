const path = require('path');

const transformStyles = require('../src/transformStyles');

/*
  each of these below is to do manual testing that style generation is successful
 */
transformStyles({
  hash: 'uiBaseStylesButton',
  // minify: false,
  source: path.join(__dirname, 'styles.scss'),
  target: path.join(__dirname, 'styles-sass.js')
});

transformStyles({
  hash: 'uiBaseStylesButton',
  // minify: false,
  source: path.join(__dirname, 'styles.less'),
  target: path.join(__dirname, 'styles-less.js')
});

transformStyles({
  hash: 'uiBaseStylesButton',
  // minify: false,
  source: path.join(__dirname, 'styles.css'),
  target: path.join(__dirname, 'styles-css.js')
});

/*
  this is the one that will actually be imported into the playground app
 */
transformStyles({
  hash: 'uiBaseStylesButton',
  // minify: false,
  source: path.join(__dirname, 'styles.scss'),
  target: path.join(__dirname, 'styles-sass.js')
});
