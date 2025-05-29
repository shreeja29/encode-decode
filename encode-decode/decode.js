
const { REVERSE_MAP_SYMBOL } = require('../constants');
const validateInput = require('../helpers/validate');
const isPunctuationOrEmoji = require('../helpers/punctuation');

function decode(text) {
  console.log({text});
  
  validateInput(text);

  return [...text].map(char => {
    if (REVERSE_MAP_SYMBOL[char]) {
      return REVERSE_MAP_SYMBOL[char];
    }

    const cp = char.charCodeAt(0);
    if ((cp < 32 && cp !== 10) || cp === 127) {
      const err = new Error("Unsupported control character.");
      err.code = "UNSUPPORTED_CONTROL_CHAR";
      throw err;
    }

    if (!REVERSE_MAP_SYMBOL[char]) {
      if (isPunctuationOrEmoji(char)) {
        return char;
      }
      const err = new Error("Unknown symbol.");
      err.code = "UNKNOWN_SYMBOL";
      throw err;
    }
    console.log({char});
    
    return char;
  }).join('');
}

module.exports = {decode};
