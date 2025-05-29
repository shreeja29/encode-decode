// backend/punctuation.js

const { PUNCTUATION_CHARS } = require('../constants');

function isPunctuationOrEmoji(char) {
  if (PUNCTUATION_CHARS.includes(char)) return true;
  if (char === ' ') return true;

  const cp = char.codePointAt(0);
  return (
    (cp >= 0x1F300 && cp <= 0x1F5FF) || // Misc Symbols and Pictographs
    (cp >= 0x1F600 && cp <= 0x1F64F) || // Emoticons
    (cp >= 0x1F680 && cp <= 0x1F6FF) || // Transport and Map
    (cp >= 0x2600 && cp <= 0x26FF) ||   // Misc symbols
    (cp >= 0x2700 && cp <= 0x27BF)      // Dingbats
  );
}

module.exports = isPunctuationOrEmoji;
