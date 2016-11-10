const postcss = require('postcss');

const LOCAL_ENCAPSULATION_PATTERN = /:local\(([^)]+)\)/g;
const SELECTOR_PATTERN = /[-_.#]+([a-zA-Z])/g;

const firstLetterOfWordReplacer = (string, character) => {
  switch (string[0]) {
    case '.':
      return `.${character.toLowerCase()}`;

    case '#':
      return `#${character.toLowerCase()}`;

    default:
      return `${character.toUpperCase()}`;
  }
};

const camelCaser = (rule) => {
  rule.selector = rule.selector.replace(LOCAL_ENCAPSULATION_PATTERN, (a, match) => {
    return `:local(${match.replace(SELECTOR_PATTERN, firstLetterOfWordReplacer)})`;
  });

  return rule;
};

module.exports = {
  camelCaser,
  default: postcss.plugin('postcss-camelcaser', () => {
    return (css) => {
      css.walkRules(camelCaser);
    };
  }),
  firstLetterOfWordReplacer
};
