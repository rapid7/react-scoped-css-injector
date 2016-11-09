import test from 'ava';
import React from 'react';
import {
  mount,
  shallow
} from 'enzyme';
import sinon from 'sinon';

import injectCss from 'src/index';

import * as utils from 'src/utils';

const Component = () => {
  return (
    <div/>
  );
};

test('if injectCss will throw an error if the incorrect values are passed', (t) => {
  t.throws(() => {
    injectCss();
  });
});

test('if injectCss returns a function', (t) => {
  const result = injectCss({
    css: 'foo',
    id: 'bar',
    selectors: {}
  });

  t.true(typeof result === 'function');
});

test('if injectCss returns a function that receives a component and returns a HOC', (t) => {
  const decorator = injectCss({
    css: 'foo',
    id: 'bar',
    selectors: {}
  });

  const result = decorator(Component);

  t.true(React.Component.isPrototypeOf(result));
});

test('if injectCss will call injectStyleTag when mounted', (t) => {
  const decorator = injectCss({
    css: 'foo',
    id: 'bar',
    selectors: {}
  });

  const stub = sinon.stub(utils, 'injectStyleTag');

  const WrappedComponent = decorator(Component);

  mount(<WrappedComponent/>);

  t.true(stub.calledOnce);

  stub.restore();
});

test('if injectCss will return a component that will have the selectors as props', (t) => {
  const selectors = {
    foo: 'bar'
  };
  const decorator = injectCss({
    css: 'foo',
    id: 'bar',
    selectors
  });

  const WrappedComponent = decorator(Component);
  const wrapper = shallow(<WrappedComponent/>);

  t.deepEqual(wrapper.props(), {
    selectors
  });
});