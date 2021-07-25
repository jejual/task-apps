'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const controllerLoader = require('./utils/controller_loader');
const healthCheckController = require('./utils/health_check');

module.exports.start = async ({
    //list of dependencies service injections
    env,
    logger,
    db,
    taskService
}) => {
    const app = express();

    app.db = db;
    app.sequelize = db.sequelize;
    app.taskService = taskService;

    //enrich app.use
    app.logger = logger;

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());

    healthCheckController(app);

    controllerLoader.loadToAppFromPath(
        app,
        require('path').join(__dirname, 'controllers')
    );

    //block unknown path
    app.use('*', (req, res) => {
        res.status(401).send('Unauthorized');
    });

    await app.sequelize.sync();

    const server = app.listen(env.PORT || 8111);

    logger.info(`Server is start listening at port: ${env.PORT || 8111}`, {});

    return server;
};