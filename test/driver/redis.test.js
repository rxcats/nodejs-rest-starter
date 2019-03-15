const assert = require('assert');
const redis = require('../../src/driver/redis');
const logger = require('../../src/util/logger');

describe('redis test', () => {
  before((done) => {
    redis.connect();
    done();
  });

  it('get test', (done) => {
    setTimeout((async () => {
      await redis.setValue('test', 'just test', 2);

      const result = await redis.getValue('test');
      logger.info('%O', result);
      
      assert.deepStrictEqual(result, 'just test');
      done();
    }), 500);
  })
});
