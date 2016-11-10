import test from 'ava';
import sinon from 'sinon';

import fs from 'fs';
import sass from 'node-sass';

import transformStyles from 'src/transformStyles';

test.serial('if transformStyles will convert the styles to an object correctly with scss files', async (t) => {
  const selector = 'foo';
  const cssString = 'display: block;';
  const hash = 'foobar';

  const sassStub = sinon.stub(sass, 'renderSync', () => {
    const css = new Buffer(`.${selector} {${cssString}}`);

    return {
      css
    };
  });
  const fsStub = sinon.stub(fs, 'writeFileSync');

  const result = await transformStyles({
    hash,
    source: 'bar.scss',
    target: 'baz.css'
  });

  t.deepEqual(result, {
    css: `._${hash}__${selector}{display:block}`,
    id: `${hash}_Scoped_Styles`,
    selectors: {
      foo: `_${hash}__${selector}`
    }
  });

  sassStub.restore();
  fsStub.restore();
});

test.serial('if transformStyles will convert the styles to an object correctly with css files', async (t) => {
  const selector = 'foo';
  const cssString = 'display: block;';
  const hash = 'foobar';

  const fsReadFileStub = sinon.stub(fs, 'readFileSync', () => {
    return new Buffer(`.${selector} {${cssString}}`);
  });
  const fsWriteFileStub = sinon.stub(fs, 'writeFileSync');

  const result = await transformStyles({
    hash,
    source: 'bar.css',
    target: 'baz.css'
  });

  t.deepEqual(result, {
    css: `._${hash}__${selector}{display:block}`,
    id: `${hash}_Scoped_Styles`,
    selectors: {
      foo: `_${hash}__${selector}`
    }
  });

  fsReadFileStub.restore();
  fsWriteFileStub.restore();
});