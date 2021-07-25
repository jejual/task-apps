'use strict';

require('dotenv').config();

const Server = require('./server');
const Logger = require('./utils/init_logger');
const env = process.env;
const dbConfig = require('./config/db_config')(env);

const TaskDAO = require('./daos/task_dao');

const TaskService = require('./services/task_service');

(
    async () => {

        //list of dependencies injections
        const logger = new Logger(env.NODE_ENV || 'local');

        try {
            const db = require('./utils/model_loader')(dbConfig, `${__dirname}/models`);

            //injection for DAO
            const taskDAO = new TaskDAO({ db });

            //injection for logic in service
            const taskService = new TaskService({ taskDAO });

            Server.start({
                env,
                db,
                logger,
                taskService
            });
        } catch (error) {
            logger.error('Server crashed or failed to start', {}, error);
            process.exit();
        }
    }
)();