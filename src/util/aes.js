const GibberishAes = require('./gibberish.aes')();

const key = 'abcdefghijklmnopqrstuvwxyz123456';

/**
 * @param {string} text
 * @returns {string}
 */
exports.encode = (text) => {
  GibberishAes.size(256);
  return GibberishAes.aesEncrypt(text, key);
};

/**
 * @param {string} base64Text
 * @returns {string}
 */
exports.decode = (base64Text) => {
  GibberishAes.size(256);
  return GibberishAes.aesDecrypt(base64Text, key);
};
