const path = require('path');

const transformStyles = require('../src/transformStyles');

transformStyles({
  hash: 'uiBaseStylesButton',
  source: path.join(__dirname, 'styles.scss'),
  target: path.join(__dirname, 'styles.js')
});
