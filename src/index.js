// external dependencies
import React, {
  Component
} from 'react';

// utils
import {
  injectStyleTag
} from './utils';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

let activeInstancesCount = 0;

/**
 * decorator which receives the generated styles and adds / removes the style tag
 * with the values, and then passing the selectors down as props
 *
 * @param {string} css
 * @param {string} id
 * @param {Object} selectors
 * @returns {function(Component): Component}
 */
const injectCss = ({css = '', id, selectors = {}} = {}) => {
  if (!id && !IS_PRODUCTION) {
    throw new TypeError('You have not passed an ID for the style tag to inject. Have you created the object ' +
      'correctly with transformStyles?');
  }

  return (PassedComponent) => {
    class StylizedComponent extends Component {
      constructor(...args) {
        super(...args);

        const existingTag = document.getElementById(id);

        if (!existingTag) {
          injectStyleTag(id, css);
        }

        activeInstancesCount++;
      }

      componentWillUnmount() {
        activeInstancesCount--;

        if (activeInstancesCount === 0) {
          const existingTag = document.getElementById(id);

          existingTag.parentNode.removeChild(existingTag);
        }
      }

      render() {
        return (
          <PassedComponent
            {...this.props}
            selectors={selectors}
          />
        );
      }
    }

    return StylizedComponent;
  };
};

export default injectCss;
