const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const compress = require('compression');
const httpLogger = require('morgan');
const error = require('./error/error');
const { port, contentType } = require('./config/app.config');
const aes = require('./util/aes');
const logger = require('./util/logger');

fs.writeFile('app.pid', process.pid, (err) => {
  if (err) {
    logger.error('write pid failed:%s', err.message);
  } else {
    logger.info('process id:%d', process.pid);
  }
});

app.use(httpLogger('dev'));

/**
 * request body converter
 * @param {Request} req
 * @param {Response} res
 * @param {Buffer} buf
 * @param {string} encoding
 */
const rawBodySaver = (req, res, buf, encoding) => {
  let jsonBody = '{}';
  req.rawBody = {};
  req.isEncrypt = false;
  if (buf && buf.length > 0) {
    try {
      // convert encryption packet
      const body = buf.toString(encoding || 'utf8').trim();
      if (body) {
        if (!(body.startsWith('{') && body.endsWith('}'))) {
          req.isEncrypt = true;
          jsonBody = aes.decode(body);
        } else {
          jsonBody = body;
        }
        req.rawBody = JSON.parse(jsonBody);
      }
      logger.debug('request json: %s', jsonBody);
    } catch (e) {
      logger.error('request parse error: %O', e);
      throw e;
    }
  }
};

// check content type
app.use('*', (req, res, next) => {
  if (!req.is(contentType)) {
    throw new Error(`invalid content type: ${req.get('Content-Type')}`);
  }
  next();
});

app.use(bodyParser.raw({ type: contentType, verify: rawBodySaver }));

app.use(compress());

app.use('/', require('./routes'));

app.use(error.converter);

const server = app.listen(port, () => {
  logger.info('server started! port: %s', port);
});

const shutdown = () => {
  server.close(() => {
    logger.info('Http server closed.');
    process.exit(0);
  });
};

// shutdown hook
process.on('SIGINT', () => {
  shutdown();
});
