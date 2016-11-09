import React from 'react';
import {
  render
} from 'react-dom';

import injectCss from '../src';
import styles from './styles';

console.log(styles);

@injectCss(styles)
class ClassComponent extends React.Component {
  render() {
    const {
      selectors
    } = this.props;

    return (
      <div className={selectors.foo}>
        I am a class component with the foo className
      </div>
    );
  }
}

const FunctionalComponent = injectCss(styles)(({selectors}) => {
  return (
    <div className={selectors.bar}>
      I am a functional component with the bar className
    </div>
  );
});

const App = () => {
  return (
    <div>
      <h1>
        App
      </h1>

      <ClassComponent/>

      <FunctionalComponent/>
    </div>
  );
};

const div = document.createElement('div');

div.id = 'app-content';

render((
  <App/>
), div);

document.body.appendChild(div);
