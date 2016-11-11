import test from 'ava';
import isPlainObject from 'lodash/isPlainObject';
import sinon from 'sinon';

import fs from 'fs';
import path from 'path';

import * as utils from 'src/transform/utils';

test.todo('applyCssModules');
test.todo('generateTransformedStylesFile');
test.todo('getPrefixedCss');
test.todo('getRenderedCss');

test('if resolveUrlPath maps the url correctly', (t) => {
  const unchangedReference = 'foo';
  const pathedReference = '~foo';

  const unchangedResult = utils.resolveUrlPath(unchangedReference);

  t.is(unchangedResult, unchangedReference);

  const pathedResult = utils.resolveUrlPath(pathedReference);

  t.is(pathedResult, path.join(__dirname, '..', '..', 'node_modules', 'ava', 'lib', 'node_modules', 'foo'));
});

test.serial('if saveFile will trigger the writing of the file with the correct value', (t) => {
  const hash = 'foo';
  const id = `${hash}_Scoped_Styles`;
  const target = 'bar.css';
  const injectableSource = '._foo__bar{display:block}';
  const exportTokens = {
    bar: '_foo__bar'
  };

  const expectedBufferString = `module.exports = {'css':'${injectableSource}', 'id':'${id}', 'selectors':{'bar':'${exportTokens.bar}'}};\n`;

  const stub = sinon.stub(fs, 'writeFileSync', (passedTarget, buffer) => {
    t.is(passedTarget, target);
    t.is(buffer.toString('utf8'), expectedBufferString);
  });

  const saveFileFunction = utils.saveFile(hash, target);

  const result = saveFileFunction({
    exportTokens,
    injectableSource
  });

  t.true(isPlainObject(result));

  stub.restore();
});