const sleep = require('system-sleep');
const mysql = require('../src/driver/mysql');
const redis = require('../src/driver/redis');

let mysqlReady = false;
let redisReady = false;

exports.initMysql = () => {
  if (!mysqlReady) {
    mysql.createPool();
    mysqlReady = true;
    sleep(500);
  }
};

exports.initRedis = () => {
  if (!redisReady) {
    redis.connect();
    redisReady = true;
    sleep(500);
  }
};

exports.initAll = () => {
  this.initMysql();
  this.initRedis();
};
