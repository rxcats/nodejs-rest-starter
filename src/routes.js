const express = require('express');
const helloController = require('./controller/hello.controller');
const aes = require('./util/aes');
const logger = require('./util/logger');
const Response = require('./model/message/Response');
const { contentType } = require('./config/app.config');

const router = express.Router();

const wrap = asyncFunction => (async (req, res, next) => {
  try {
    const result = await asyncFunction(req, res, next);
    const json = JSON.stringify(Response.of(result));
    res.setHeader('Content-Type', contentType);
    res.rawBody = json;
    if (req.isEncrypt) {
      const body = aes.encode(json);
      res.send(body);
    } else {
      res.send(json);
    }
  } catch (error) {
    next(error);
  }
});

router.post('/v1/hello', wrap(helloController.hello));
router.post('/v1/hello/error', wrap(helloController.helloError));

module.exports = router;
