const mongoose = require('mongoose');

const {env} = require('../../src/config/app.config');
const {mongodb} = require(`../../src/config/${env}/db.config`);
const logger = require('../../src/util/logger');

const Player = require('../../src/model/mongodb/player.model');

describe('player.model.test', () => {
  before(async () => {
    try {
      await mongoose.connect(mongodb.url, {useNewUrlParser: true});
    } catch(err) {
      logger.error('mongodb connection failed. %O', err);
    }
  });

  after(async () => {
    try {
      await mongoose.connection.close();
    } catch (err) {
      logger.error('mongodb connection close failed. %O', err);
    }
  });

  it('test', async () => {
    const p = await Player.findById(1);
    logger.info('p: %O', p);
  });
});
