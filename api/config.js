module.exports = {
    server: {
        port: 3000,
        host: 'localhost',
        lifeTimeRefreshToken: '1m', // use only d - days, m - months, y - years
        dbHost: 'localhost:27017',
        dbName: 'dictionary',
    },
    common: {
        lifeTimeAccessToken: '2m', // use only m - minutes, h - hours, d - days;
        
    }
}