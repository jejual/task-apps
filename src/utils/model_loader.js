'use strict';

const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');
const { removeNullKey } = require('./object_util');

const STATEMENT_TIMEOUT = process.env.STATEMENT_TIMEOUT || 30000;

module.exports = (dbConfig, modelsDirectoryPath) => {
    const db = {
        models: {}
    };

    Sequelize.Model.prototype.toJSONv2 = function () {
        return removeNullKey(this.toJSON());
    };

    let sequelize;
    if (dbConfig.uri) {
        //build DB connection using URI
        sequelize = new Sequelize(dbConfig.uri, {
            ...dbConfig.pool,
            logging: false,
            dialectOptions: {
                connectTimeout: STATEMENT_TIMEOUT
            }
        });
    } else if (dbConfig.socketpath) {
        // build DB connection using UNIX socket connection
        sequelize = new Sequelize(
            dbConfig.database,
            dbConfig.user,
            dbConfig.password,
            {
                dialect: dbConfig.dialect,
                host: dbConfig.host,
                dialectOptions: {
                    socketPath: dbConfig.socketpath,
                    connectTimeout: STATEMENT_TIMEOUT
                }
            }
        );
    }
    
    const files = fs.readdirSync(modelsDirectoryPath);
    
    files.map(file => {
        const model = require(path.join(modelsDirectoryPath, file))(sequelize, Sequelize.DataTypes);
        db.models[model.name] = model;
    });
    
    Object.keys(db.models).map(modelName => {
        if (db.models[modelName].associate) {
            db.models[modelName].associate(db.models);
        }
    });
    
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
};