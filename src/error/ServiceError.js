module.exports = class ServiceError {
  /**
   * @param {number} code
   * @param {string} message
   * @param {object} stack
   */
  constructor(code, message, stack = undefined) {
    this.code = code;
    this.message = message;
    this.stack = stack;
  }
};
