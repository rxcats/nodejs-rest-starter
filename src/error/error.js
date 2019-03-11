const { ValidationError } = require('jsonschema');
const ServiceError = require('./ServiceError');
const aes = require('../util/aes');
const { contentType } = require('../config/app.config');

exports.converter = (err, req, res, next) => {
  let json = '';
  if (err instanceof ServiceError) {
    json = JSON.stringify(err);
  } else if (err instanceof ValidationError) {
    json = JSON.stringify(new ServiceError(-1, err.message, err));
  } else if (err instanceof Error) {
    json = JSON.stringify(new ServiceError(-1, err.message, err.stack));
  }
  
  res.rawBody = json;

  res.setHeader('Content-Type', contentType);
  
  if (req.isEncrypt) {
    res.send(aes.encode(json));
  } else {
    res.send(json);
  }
  
  next();
};
