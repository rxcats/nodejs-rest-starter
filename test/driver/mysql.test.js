const assert = require('assert');
const mysql = require('../../src/driver/mysql');
const logger = require('../../src/util/logger');

describe('mysql test', () => {
  before((done) => {
    mysql.createPool();
    done();
  });
  
  it('select one test', async () => {
    const result = await mysql.select('common', 'SELECT 1 AS one', []);
    logger.info('%O', result[0]);
    assert.deepStrictEqual(1, result[0]['one']);
  })
});
