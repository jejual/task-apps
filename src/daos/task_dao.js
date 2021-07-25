'use strict';

const assert = require('assert-plus');

const TaskDAO = function ({ db }) {
    assert.object(db);

    this.db = db;
};

TaskDAO.prototype.create = async function( taskData ) {
    assert.object(taskData);

    let task;
    try {
        task = await this.db.models.tasks.create(taskData);
    } catch (error) {
        throw new Error(error);
    }

    return task.toJSONv2();
};

TaskDAO.prototype.getById = async function( id )  {
    assert.string(id);

    try {
        const result = await this.db.models.tasks.findOne({
            where: {
                id
            }
        });
        return result ? result.toJSONv2() : null;
    } catch (error) {
        throw new Error(error);
    }
};

TaskDAO.prototype.getMany = async function() {
    try {
        const result = await this.db.models.tasks.findAll();
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

TaskDAO.prototype.update = async function (query, updateData) {
    assert.object(updateData);
    assert.object(query);
    assert.string(query.where.id);

    try {
        const result = await this.db.models.tasks.update(updateData, query);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = TaskDAO;