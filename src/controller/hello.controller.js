const { validate } = require('jsonschema');

const helloService = require('../service/hello.service');

module.exports.hello = async (req) => {
  validate(req.rawBody.data, {
    type: 'object',
    required: ['name'],
  }, { throwError: true });

  return await helloService.hello(req.rawBody.data.name);
};

module.exports.helloError = async (req) => {
  validate(req.rawBody.data, {
    type: 'object',
    required: ['name'],
  }, { throwError: true });

  return await helloService.helloError(req.rawBody.data.name);
};
