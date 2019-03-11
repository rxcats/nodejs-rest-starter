const redis = require('redis');

const { env } = require('../config/app.config');
const config = require(`../config/${env}/db.config`);
const logger = require('../util/logger');

const { enable, server } = config.redis;
const { host, port, password, database, retryMillis } = server;

let redisClient;

exports.connect = () => {
  if (!enable) {
    logger.info('redis disabled');
    return;
  }
  
  if (redisClient) {
    return;
  }
  
  redisClient = redis.createClient({
    host: host,
    port: port,
    password: password,
    db: database,
    'retry_strategy': (opts) => {
      logger.info('redis retry connect, retry count:(%d), retry total ms:(%d)', opts.attempt, opts.total_retry_time);
      return retryMillis;
    }
  });

  redisClient.on('connect', () => {
    logger.info('redis connected');
  });

  redisClient.on('reconnecting', () => {
    logger.info('redis reconnecting');
  });

  redisClient.on('error', (err) => {
    logger.error('redis error: %O', err);
  });

  redisClient.on('end', () => {
    logger.info('redis closed');
  });
};

exports.close = () => {
  if (!enable) {
    return;
  }

  if (!redisClient) {
    return;
  }

  redisClient.quit();
  redisClient = null;
};

const isActive = () => !(!enable || !redisClient || !redisClient.connected);

exports.getClient = () => {
  if (!enable) {
    throw new Error('redis disabled');
  }

  if (!redisClient) {
    throw new Error('redis client is empty, try connect first.');
  }

  return redisClient;
};

exports.getValue = async (key) => new Promise((resolve, reject) => {
  if (!isActive()) {
    return resolve(null);
  }
  redisClient.get(key, (err, reply) => {
    if (err) {
      return reject(err);
    } else if (reply === null) {
      return resolve(null);
    } else {
      return resolve(JSON.parse(reply));
    }
  });
});

exports.setValue = async (key, value, ttl = 0) => new Promise((resolve, reject) => {
  if (!isActive()) {
    return resolve(value);
  }
  const json = JSON.stringify(value);
  if (ttl <= 0) {
    redisClient.set(key, json, (err) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(value);
      }
    });
  } else {
    redisClient.set(key, json, 'EX', ttl, (err) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(value);
      }
    });
  }
});

exports.delValue = async key => new Promise((resolve, reject) => {
  if (!isActive()) {
    return resolve(null);
  }
  redisClient.delete(key, (err, reply) => {
    if (err) {
      return reject(err);
    } else if (reply === null) {
      return resolve(null);
    } else {
      return resolve(JSON.parse(reply));
    }
  });
});
