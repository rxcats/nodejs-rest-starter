const fs = require('fs');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const appConfig = require('../config/app.config');
const { level, types, dir, filename, zippedArchive, maxSize, maxFiles } = appConfig.logger;

const logDir = `${__dirname}/../../${dir}`;

const config = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'blue',
    trace: 'grey',
  }
};

winston.addColors(config.colors);

const logPrint = (info) => {
  return `${new Date().toISOString()} ${info[Symbol.for('message')]}`;
};

const transportConsole = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.simple(),
    winston.format.printf(logPrint)
  )
});

const transportFile = new DailyRotateFile({
  filename: `${logDir}/${filename}`,
  zippedArchive: zippedArchive,
  maxSize: maxSize,
  maxFiles: maxFiles,
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
    winston.format.printf(logPrint)
  )
});

const _transports = () => {
  const trans = [];

  if (types.includes('console')) {
    trans.push(transportConsole);
  }

  if (types.includes('file')) {
    trans.push(transportFile);
  }

  return trans;
};

const logger = winston.createLogger({
  levels: config.levels,
  transports: _transports(),
  level: level
});

// create log dir
fs.existsSync(logDir) || fs.mkdirSync(logDir);

module.exports = logger;
