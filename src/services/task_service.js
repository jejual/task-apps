'use strict';

const assert = require('assert-plus');
const _ = require('underscore');

const TaskService = function ({
    taskDAO
}){
    assert.object(taskDAO);

    this.taskDAO = taskDAO;
};

TaskService.prototype.createTask = async function ( taskData ) {
    const {
        taskDAO
    } = this;

    try {
        const result = await taskDAO.create(taskData);

        return result;
    } catch (error) {
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: error.message
        };
    }
};

TaskService.prototype.getById = async function ( taskId ) {
    const {
        taskDAO
    } = this;

    try {
        const result = await taskDAO.getById(taskId);

        return result;
    } catch (error) {
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: error.message
        };
    }
};

TaskService.prototype.getMany = async function () {
    const {
        taskDAO
    } = this;

    try {
        const result = await taskDAO.getMany();

        return result;
    } catch (error) {
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: error.message
        };
    }
};

TaskService.prototype.update = async function ( data ) {
    const {
        taskDAO
    } = this;

    try {
        await taskDAO.update(
            {
                where: {
                    id: data.id
                }
            },
            {
                ...data.taskData
            }
        );

        const result = await taskDAO.getById(data.id);

        return result;
    } catch (error) {
        throw {
            error_code: 'INTERNAL_SERVER_ERROR',
            message: error.message
        };
    }
};

module.exports = TaskService;