const assert = require('assert'); 

const aes = require('../../src/util/aes');
const logger = require('../../src/util/logger');

describe('aes test', () => {
  it('encode decode test', (done) => {
    const obj = {
      data: {
        name: 'john',
      },
    };

    const encrypted = aes.encode(JSON.stringify(obj));
    logger.info('encrypted:%s', encrypted);
    assert.deepStrictEqual(encrypted.trim(), 'sZ/aEZmam3PD3QFoJ5zPesFW10e9OW55TSoFyUDOWDk=');
    
    const decrypted = aes.decode(encrypted);
    logger.info('decrypted:%s', decrypted);
    assert.deepStrictEqual(JSON.parse(decrypted), obj);

    done();
  });
});
