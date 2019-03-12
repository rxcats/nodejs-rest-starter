const mongoose = require('mongoose');
const sleep = require('system-sleep');

const {env} = require('../../src/config/app.config');
const {mongodb} = require(`../../src/config/${env}/db.config`);
const logger = require('../../src/util/logger');

const Player = require('../../src/model/mongodb/player.model');

describe('player.model.test', () => {
  before(() => {
    mongoose.connect(mongodb.url, {useNewUrlParser: true})
      .then(() => {
        logger.info('mongodb connection success.');
      })
      .catch(e => {
        logger.error('mongodb connection failed. %O', e);
      });

    sleep(500);
  });
  
  after(() => {
    mongoose.connection.close();
  });

  it('test', async () => {
    const p = await Player.findById(1);
    logger.info('p: %O', p);
  });
});