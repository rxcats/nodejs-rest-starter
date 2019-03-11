const assert = require('assert');
const mysql = require('../../src/driver/mysql');
const logger = require('../../src/util/logger');
const loader = require('../loader');

describe('mysql test', () => {
  before(() => {
    loader.initMysql();
  });
  
  it('select one test', async () => {
    const result = await mysql.select('common', 'SELECT 1 AS one', []);
    logger.info('%O', result[0]);
    assert.deepStrictEqual(1, result[0]['one']);
  })
});
