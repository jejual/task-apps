'use strict';

const assert = require('assert-plus');
const fs = require('fs');

const logLocation = process.env.LOG_LOCATION || 'logs';
const fileName = 'note_apps_log';

class Logger{
    constructor(env) {
        assert.string(env);

        this.log = console.log;
        this.env = env;
        this.fileStream = function(data) {
            if (env !== 'production') {
                if (!fs.existsSync(logLocation)){
                    fs.mkdirSync(logLocation);
                }
                return fs.appendFileSync(`${logLocation}` + `/${fileName}`, data + '\n');
            }

            return null;
        };
    }

    info(message, context) {
        assert.string(message);
        assert.optionalObject(context);

        const data = JSON.stringify({
            level: 'info',
            timestamp: new Date(),
            message,
            context
        });

        this.fileStream(data);
        this.log(data);

        return null;
    }

    error(message, context, err) {
        assert.string(message);
        assert.object(err);
        assert.optionalObject(context);

        const data = JSON.stringify({
            level: 'error',
            timestamp: new Date(),
            message,
            context
        });

        this.fileStream(data);
        this.log(data);

        return null;
    }
}


module.exports = Logger;