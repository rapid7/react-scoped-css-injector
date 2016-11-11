import test from 'ava';
import sinon from 'sinon';

import fs from 'fs';
import sass from 'node-sass';

import transformStyles from 'src/transformStyles';

test.serial('if transformStyles will convert the styles to an object correctly with scss files', async (t) => {
  const selector = 'foo';
  const hash = 'foobar';
  const source = 'helpers/foo.scss';

  const sassStub = sinon.stub(sass, 'renderSync', () => {
    const css = fs.readFileSync(source);

    return {
      css
    };
  });
  const fsStub = sinon.stub(fs, 'writeFileSync');

  const result = await transformStyles({
    hash,
    source,
    target: 'bar.css'
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

test.serial('if transformStyles will convert the styles to an object correctly with less files', async (t) => {
  const selector = 'foo';
  const hash = 'foobar';
  const source = 'helpers/foo.less';

  const sassStub = sinon.stub(sass, 'renderSync', () => {
    const css = fs.readFileSync(source);

    return {
      css
    };
  });
  const fsStub = sinon.stub(fs, 'writeFileSync');

  const result = await transformStyles({
    hash,
    source,
    target: 'bar.css'
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
  const hash = 'foobar';

  const fsWriteFileStub = sinon.stub(fs, 'writeFileSync');

  const result = await transformStyles({
    hash,
    source: 'helpers/foo.css',
    target: 'baz.css'
  });

  t.deepEqual(result, {
    css: `._${hash}__${selector}{display:block}`,
    id: `${hash}_Scoped_Styles`,
    selectors: {
      foo: `_${hash}__${selector}`
    }
  });

  fsWriteFileStub.restore();
});