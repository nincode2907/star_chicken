'use strict';

const dev = {
    port: process.env.DEV_PORT || 2907,
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'checkVar'
    }
}

const prod = {
    port: process.env.PROD_PORT || 3000,
    db: {
        host: process.env.PROD_DB_HOST || 'localhost',
        port: process.env.PROD_DB_PORT || 27017,
        name: process.env.PROD_DB_NAME || 'checkVar'
    }
}

const configs = {
    dev,
    prod
}

const env = process.env.ENVIRONMENT || 'dev';

module.exports = configs[env];