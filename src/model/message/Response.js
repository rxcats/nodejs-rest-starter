module.exports = class Response {
  /**
   * @param {object} result
   */
  constructor(result = null) {
    this.code = 0;
    this.message = 'Success';
    this.result = result;
  }

  static of(result = null) {
    return new Response(result);
  }
};
