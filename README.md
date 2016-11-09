# react-scoped-css-injector

Import styles into files without the need for additional loader systems

#### Installation

    $ npm i react-scoped-css-injector --save
    
#### Usage

There are two steps to use this package. Let's say you have a SCSS file like this:

```scss
.foo {
  color: red;
}
```

First, you can create a simple node script to compile your styles into a JavaScript file:

```javascript
const transformStyles = require('react-scoped-css-injector/transformStyles');

transformStyles({
  hash: 'MyFancyComponent',
  source: 'src/styles.scss',
  target: 'src/styles.js'
});
```

After you compile the styles, you can import these styles into your application and apply them to your React component as such:

```javascript
import React from 'react';
import injectCss from 'react-scoped-css-injector';

import styles from 'src/styles.js';

@injectCss(styles)
class MyFancyComponent extends React.Component {
  render() {
    const {
      selectors
    } = this.props;
    
    return (
      <div className={selectors.foo}>
        I have a color of red!
      </div>
    );
  }
}
```

#### Why?

For standalone applications, the use of build systems such as `webpack` or `browserify` handles a lot of this stuff for you under-the-hood with loaders. This is awesome and makes for rapid development, but cannot translate one-to-one when you develop a consumable reusable component that you want to make available as a public npm package. Previously, there were a few ways around this:
* Write your styles with inline styles (maybe with `radium`)
* Write your styles with a JS-to-CSS library (such as `aphrodite`)
* Write your styles with CSS and expect the consuming developer to load them

Each of these have their shortcomings:
* Inline styles are inherently limited (no `@media print` support, for example)
* JS-to-CSS libraries always assume classes, and don't allow for specific selectors
* Expecting the developer to bring in a separate file is a bad DX, and they may not even bring it in the right way

As such, I created this solution. To be clear, this package is targeted for people building independently-consumable React component packages, not for standard application development. Just use webpack for that. :)

#### How does it work?

`transformStyles` will accept an object with `source` and `target` file locations, where `source` is the location of the CSS / SCSS file you want to import, and `target` is the JS file you want to save it to. The full list of options that you can pass:

```javascript
{
  hash: String, // optional, defaults to a random uuid
  minify: Boolean, // optional, defaults to true
  source: String, // required
  target: String // required
}
```

Calling `transformStyles` with these options will return a `Promise`, which when resolved returns a data object:

```javascript
{
  css: String, // compiled CSS as one big string
  id: String, // ID assigned to the style tag to be injected into the document head
  selectors: Object // selector: hashedValue pairings
}
```

This object is the same value that is saved to the file specified at your `target` location. The CSS has vendor prefixes applied for you via `autoprefixer`, so no need to do that yourself!

Now that you have your styles compiled, you can apply them to your React component with a simple decorator:

```javascript
import injectCss from 'react-scoped-css-injector';

import styles from 'wherever/you/saved/your/styles.js';

// you can use it on class components

@injectCss(styles)
class MyComponent extends React.Component {
  ...
}

// or to functional components

const MyComponent = injectCss(styles)(() => {
  ...
});
```

This will inject a `style` tag into the head of the `document` for that component, allowing the CSS to be available for use by the component. Don't worry, in the case of multiple instances of the same component, only a single tag is added.

To make use of the styles, the map from selectors to their hashed values is passed down as the `selectors` prop into the decorated component. You can then apply it as a className:

```javascript
@injectCss(styles)
class MyComponent extends React.Component {
  render() {
    const {
      selectors
    } = this.props;
    
    return (
      <div className={selectors.foo}>
        I have a scoped style!
      </div>
    )
  }
}
```

The usage of this should be very familiar if you have used CSS Modules, as it follows the same paradigm.

#### Development


Standard stuff, clone the repo and `npm i` to get the dependencies. npm scripts available:
* `build` => runs webpack to build the compiled JS file with `NODE_ENV` set to `development`
* `build:minified` => runs webpack to build the compiled and optimized JS file with `NODE_ENV` set to `production`
* `clean` => runs `rimraf` on both `lib` and `dist` directories
* `dev` => runs the webpack dev server for the playground
* `lint` => runs ESLint against files in the `src` folder
* `lint:watch` => runs `lint` with a persistent watcher
* `prepublish` => if in publish, runs `prepublish:compile`
* `prepublish:compile` => runs `clean`, `lint`, `test`, `transpile`, `build` and `build:minified`
* `test` => runs `ava` against all files in `src`
* `test:watch` => runs `test` with a persistent watcher
* `transform` => compiles the `styles.scss` file in the playground App
* `transform:watch` => runs `transform` with a persistent watcher
* `transpile` => runs Babel against files in `src` to files in `lib`
