// backend/validate.js

function validateInput(text) {
    const codePoints = [...text];
    if (codePoints.length > 280) {
      const err = new Error("Input is too long.");
      err.code = "INPUT_TOO_LONG";
      throw err;
    }
  
    for (let char of codePoints) {
      const cp = char.charCodeAt(0);
      if ((cp < 32 && cp !== 10) || cp === 127) {
        const err = new Error("Unsupported control character.");
        err.code = "UNSUPPORTED_CONTROL_CHAR";
        throw err;
      }
    }
  }
  
  module.exports = validateInput;
  