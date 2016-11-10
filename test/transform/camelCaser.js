import test from 'ava';

import {
  camelCaser,
  firstLetterOfWordReplacer
} from 'src/transform/camelCaser';

test('if firstLetterOfWordReplacer will replace the first letter of the word correctly', (t) => {
  const classResult = firstLetterOfWordReplacer('.f', 'f');
  const idResult = firstLetterOfWordReplacer('#f', 'f');
  const dashResult = firstLetterOfWordReplacer('-b', 'b');
  const underscoreResult = firstLetterOfWordReplacer('_b', 'b');

  t.is(classResult, '.f');
  t.is(idResult, '#f');
  t.is(dashResult, 'B');
  t.is(underscoreResult, 'B');
});

test('if camelCaser will convert the values correctly', (t) => {
  const single = ':local(.foo-bar)';
  const multiple = ':local(.foo-bar) :local(#baz_foo)';
  const withPseudo = ':local(.foo-bar):first-letter :local(#baz-foo)';

  const singleResult = camelCaser({
    selector: single
  });

  t.deepEqual(singleResult, {
    selector: ':local(.fooBar)'
  });

  const multipleResult = camelCaser({
    selector: multiple
  });

  t.deepEqual(multipleResult, {
    selector: ':local(.fooBar) :local(#bazFoo)'
  });

  const withPseudoResult = camelCaser({
    selector: withPseudo
  });

  t.deepEqual(withPseudoResult, {
    selector: ':local(.fooBar):first-letter :local(#bazFoo)'
  });
});