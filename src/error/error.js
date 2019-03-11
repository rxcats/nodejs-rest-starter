const { ValidationError } = require('jsonschema');
const ServiceError = require('./ServiceError');
const aes = require('../util/aes');
const { contentType } = require('../config/app.config');

exports.converter = (err, req, res, next) => {
  let json = '';
  if (err instanceof ServiceError) {
    console.log('jsonError:%s', JSON.stringify(err));
    json = JSON.stringify(err);
  } else if (err instanceof ValidationError) {
    console.log('jsonError:%s', JSON.stringify(new ServiceError(-1, err.message, err)));
    json = JSON.stringify(new ServiceError(-1, err.message, err));
  } else if (err instanceof Error) {
    json = JSON.stringify(new ServiceError(-1, err.message, err.stack));
  }
  
  console.log('jsonError:%s', json);

  res.setHeader('Content-Type', contentType);
  
  if (req.isEncrypt) {
    res.send(aes.encode(json));
  } else {
    res.send(json);
  }
  
  next();
};
