/**
 * inject the style tag into the head of the document
 * 
 * @param {string} id
 * @param {string} css
 * @returns {HTMLElement}
 */
const injectStyleTag = (id, css) => {
  const style = document.createElement('style');

  style.id = id;
  style.textContent = css;

  document.head.appendChild(style);

  return style;
};

export {injectStyleTag};
