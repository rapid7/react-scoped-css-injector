import test from 'ava';

import {
  injectStyleTag
} from 'src/utils';

test('if injectStyleTag will create a style tag, inject it into the head, and return the tag', (t) => {
  const id = 'foo';
  const css = '.bar {display: block;}';

  const currentTag = document.getElementById(id);

  t.is(currentTag, null);

  const result = injectStyleTag(id, css);

  const addedTag = document.getElementById(id);

  t.not(addedTag, null);
  t.is(addedTag.nodeType, 1);
  t.is(result, addedTag);
});