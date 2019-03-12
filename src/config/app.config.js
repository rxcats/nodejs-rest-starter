module.exports = {
  env: 'local',
  port: 8080,
  contentType: 'application/vnd.rxcats.api',
  logger: {
    level: 'trace',
    types: ['console'], // 'console', 'file'
    dir: 'log',
    filename: 'app-%DATE%.log',
    zippedArchive: true,
    maxSize: '1024m',
    maxFiles: '30d',
  }
};