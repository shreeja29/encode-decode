
const { SYMBOL_MAP, UPPER_SYMBOL_MAP } = require('../constants');
const validateInput = require('../helpers/validate');

function encode(text) {
  validateInput(text);

  return [...text].map(char => {
    if (char >= 'a' && char <= 'z') {
      return SYMBOL_MAP[char] || char;
    }
    if (char >= 'A' && char <= 'Z') {
      return UPPER_SYMBOL_MAP[char] || SYMBOL_MAP[char.toLowerCase()] || char;
    }
    return char; 
  }).join('');
}

module.exports = {encode};
