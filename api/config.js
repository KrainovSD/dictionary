export default {
  server: {
    port: 3000,
    host: 'localhost',
    liveTimeRefreshToken: '1d', // use only m - minutes, h - hours, d - days;
    dbHost: 'localhost:27017',
    dbName: 'dictionary',
    postLog: 'krainovsddictionary@gmail.com',
    postPass: 'bccsxetozucoyfhp',
  },
  common: {
    liveTimeAccessToken: '10m', // use only m - minutes, h - hours, d - days;
    host: '127.0.0.1',
    port: '8080',
  },
};
