
const { encode } = require('../encode-decode/encode'); 
const { decode } = require('../encode-decode/decode'); 
describe('Cipher Encode/Decode', () => {

  test('encodes lowercase and uppercase letters', () => {
    expect(encode("Hello")).toBe("♄ελλ☺");
    expect(encode("Test")).toBe("τεѕτ");
  });

  test('encodes and keeps punctuation', () => {
    expect(encode("Hi!")).toBe("♄ι!");
    expect(encode("Wow, okay!")).toBe("ω☺ω, ☺καγ!");
  });

  test('encodes and keeps emojis', () => {
    expect(encode("Hello 😊")).toBe("♄ελλ☺ 😊");
  });

  test('decodes valid encoded string', () => {
    expect(decode("♄ελλ☺")).toBe("hello");
    expect(decode("τεѕτ")).toBe("test");
  });

  test('decodes with punctuation and emojis', () => {
    expect(decode("♄ι!")).toBe("hi!");
    expect(decode("ω☺ω, τ♄ατ'ѕ ¢☺☺λ 😎!")).toBe("wow, that's cool 😎!");
  });

  test('throws INPUT_TOO_LONG for strings > 280 characters', () => {
    const longText = 'a'.repeat(281);
    expect(() => encode(longText)).toThrow("Input is too long.");
  
    try {
      encode(longText);
    } catch (err) {
      expect(err.code).toBe("INPUT_TOO_LONG");
    }
  });
  
  test('throws UNSUPPORTED_CONTROL_CHAR for control characters', () => {
    const input = "Test\u0001";
    expect(() => encode(input)).toThrow("Unsupported control character.");
  
    try {
      encode(input);
    } catch (err) {
      expect(err.code).toBe("UNSUPPORTED_CONTROL_CHAR");
    }
  
    try {
      decode("τεѕτ\u0001");
    } catch (err) {
      expect(err.code).toBe("UNSUPPORTED_CONTROL_CHAR");
    }
  });
  
  test('throws UNKNOWN_SYMBOL for unmapped symbol in decode', () => {
    expect(() => decode("♄ελλ☺Ѧ")).toThrow("Unknown symbol.");
  
    try {
      decode("♄ελλ☺Ѧ");
    } catch (err) {
      expect(err.code).toBe("UNKNOWN_SYMBOL");
    }
  });
})  