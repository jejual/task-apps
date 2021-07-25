'use strict';

const { body, param } = require('express-validator');
const _ = require('underscore');
const requestAsyncHandler = require('../utils/request_async_handler');

module.exports = app => {
    const {
        taskService,
    } = app;

    app.post(
        '/tasks',
        [
            body('title', 'invalid type').exists().notEmpty().isString(),
            body('description', 'required name').exists().notEmpty().isString()
        ],
        requestAsyncHandler(
            async ( req ) => {
                /**
                 * pick should be move to use enums of custom request validation to 
                 * make it more clean
                 * */
                return await taskService.createTask(_.pick(req.body, [
                    'title',
                    'description'
                ]));
            }
        )
    );

    app.get(
        '/tasks/:task_id',
        [
            param('task_id', 'invalid task_id').exists().notEmpty().isUUID()
        ],
        requestAsyncHandler(
            async ( req ) => {
                return await taskService.getById(req.params.task_id);
            }
        )
    );

    app.get(
        '/tasks',
        [
            // this tbd filtering method and pagination to avoid abuse
        ],
        requestAsyncHandler(
            async ( req ) => {
                return await taskService.getMany();
            }
        )
    );

    app.patch(
        '/tasks/:task_id',
        [
            param('task_id', 'invalid id').exists().notEmpty().isUUID(),
            body('title', 'invalid type').exists().notEmpty().isString(),
            body('description', 'required name').exists().notEmpty().isString(),
        ],
        requestAsyncHandler(
            async ( req ) => {
                return await taskService.update({
                    id: req.params.task_id,
                    taskData: _.pick(req.body, [
                        'title',
                        'description'
                    ])
                });
            }
        )
    );
};