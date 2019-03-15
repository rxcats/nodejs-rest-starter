const mysql = require('mysql2');
const stringHash = require('string-hash');
const util = require('util');

const { env } = require('../config/app.config');
const config = require(`../config/${env}/db.config`);
const logger = require('../util/logger');

let dbPool;

module.exports.createPool = () => {
  if (dbPool) {
    return;
  }

  dbPool = {};

  const commonPool = mysql.createPool(config.database.common);
  dbPool['common'] = commonPool.promise();

  Object.values(config.database.user.list).forEach((info, shard) => {
    const shardPool = mysql.createPool(info);
    dbPool[util.format('shard%s', shard)] = shardPool.promise();
  });
};

/**
 * @returns {string[]}
 */
module.exports.getAllShardNo = () => Object.keys(config.database.user.list);

/**
 * @param {string | number} userId
 * @returns {number}
 */
module.exports.getNewShardNo = (userId) => {
  const userIdHash = stringHash(userId);
  const shardKey = (userIdHash % config.database.user.shardTarget.length);
  const shardNo = config.database.user.shardTarget[shardKey];
  // console.log(`userId: ${userId}, shardKey: ${shardKey}, shardNo: ${shardNo}`);
  return shardNo;
};

/**
 * @param {string} pool
 * @param {string} sql
 * @param {array} params
 * @param {object} clazz
 * @returns {Promise<array>}
 */
module.exports.select = async (pool, sql, params, clazz = null) => {
  const q = dbPool[pool].format(sql, params);
  logger.debug('sql: %s', q);

  const [rows] = await dbPool[pool].query(q);

  if (clazz === null) {
    return rows;
  }

  return rows.map(row => Object.assign(clazz.of(), row));
};

/**
 * @param {string} pool
 * @param {string} sql
 * @param {array} params
 * @param {object} clazz
 * @returns {Promise<object>}
 */
module.exports.selectOne = async (pool, sql, params, clazz = null) => {
  const q = dbPool[pool].format(sql, params);
  logger.debug('sql: %s', q);

  const [rows] = await dbPool[pool].query(q);

  if (rows.length === 0) {
    return null;
  }

  if (clazz === null) {
    return rows[0];
  }

  return Object.assign(clazz.of(), rows[0]);
};

/**
 * @param {string} pool
 * @param {string} sql
 * @param {array} params
 * @param {string} key
 * @param {object} clazz
 * @returns {Promise<object>}
 */
module.exports.selectMap = async (pool, sql, params, key, clazz = null) => {
  const q = dbPool[pool].format(sql, params);
  logger.debug('sql: %s', q);

  const [rows] = await dbPool[pool].query(q);

  const result = {};

  if (rows.length === 0) {
    return result;
  }

  rows.forEach((value) => {
    result[value[key]] = (clazz === null) ? value : Object.assign(clazz.of(), value);
  });

  return result;
};

/**
 * @param {string} pool
 * @param {string} sql
 * @param {array} params
 * @returns {Promise<void>}
 */
module.exports.executeQuery = async (pool, sql, params) => {
  const q = dbPool[pool].format(sql, params);
  logger.debug('sql: %s', q);

  // {PromisePool}
  await dbPool[pool].query(q);
};
