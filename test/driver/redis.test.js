const assert = require('assert');
const redis = require('../../src/driver/redis');
const logger = require('../../src/util/logger');
const loader = require('../loader');

describe('redis test', () => {
  before(() => {
    loader.initRedis();
  });

  it('get test', async () => {
    await redis.setValue('test', 'just test', 2);
    
    const result = await redis.getValue('test');
    logger.info('%O', result);
    
    assert.deepStrictEqual(result, 'just test');
  })
});
