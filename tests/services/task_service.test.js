'use strict';

const expect = require('expect.js');
const sinon = require('sinon');
const TaskService = require('../../src/services/task_service');

describe('Task Service', () => {
    let sandbox;
    let taskDAOStub;
    let taskService;

    before(() => {
        sandbox = sinon.createSandbox();

        taskDAOStub = {
            create: sandbox.stub()
        };

        taskService = new TaskService({
            taskDAO: taskDAOStub
        });
    });

    afterEach(() => {
        sandbox.reset();
    });

    describe('createTask', () => {
        describe('Success scenario', () => {
            it('should return object when create task pass request validation', async () => {
                const reqData = {
                    title: 'the title',
                    description: 'the description'
                };

                const DAOresult = {
                    ...reqData,
                    id: '123'
                };

                taskDAOStub.create.resolves(DAOresult);

                const serviceResult = await taskService.createTask(reqData);

                expect(serviceResult).to.be.an('object');
            });
        });

        describe('Failed scenario', () => {
            it('should throw error object when create task DB record error', async () => {
                const reqData = {
                    title: 'the title',
                    description: 'the description'
                };

                taskDAOStub.create.rejects({
                    message: 'create task error'
                });

                try {
                    await taskService.createTask(reqData);

                    throw 'test doesnt throw an error';
                } catch (error) {
                    expect(error.error_code).to.be.equal('INTERNAL_SERVER_ERROR');
                    expect(error.message).to.be.equal('create task error');
                }
            });
        });
    });
});