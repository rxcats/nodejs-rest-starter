module.exports = {
  database: {
    common: {
      host: '192.168.99.100',
      user: 'dev',
      password: '1111',
      port: 3306,
      database: 'commondb',
      connectionLimit: 20,
      waitForConnections: false,
    },
    user: {
      shardTarget: [0],
      list: {
        0: {
          host: '192.168.99.100',
          user: 'dev',
          password: '1111',
          port: 3306,
          database: 'userdb0',
          connectionLimit: 20,
          waitForConnections: false,
        },
      },
    },
  },
  redis: {
    enable: true,
    server: {
      host: '192.168.99.100',
      port: 6379,
      database: 0,
      password: undefined,
      retryMillis: 5000,
    },
  },
  mongodb: {
    url: 'mongodb://192.168.99.100:27017/test',
  }
};
