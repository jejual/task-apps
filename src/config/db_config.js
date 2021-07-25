'use strict';

module.exports = function(env) {
    const dbUri = env.NODE_ENV == 'production' ? env.DB_URI_PROD : env.DB_URI_DEV;

    let config = {
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        dialect: env.DB_DIALECT,
        pool: {
            max: 5,
            min: 0,
            acquire: 20000,
            idle: 20000
        }
    };

    if (dbUri && !env.DB_SOCKET_PATH) {
        return {
            uri: dbUri,
            ...config
        };
    }
    else if (env.DB_HOST && !env.DB_SOCKET_PATH) {
        return {
            ...config,
            host: env.DB_HOST,
            port: env.DB_PORT
        };
    }
    else if (env.DB_SOCKET_PATH) {
        return {
            ...config,
            host: env.DB_SOCKET_PATH,
            socketpath: env.DB_SOCKET_PATH
        };
    }    
};