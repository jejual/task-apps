'use strict';

module.exports = app => {
    const {
        env
    } = app;

    app.get(
        '/health',
        (req, res) => {            
            res
            .status(200)
            .send({
                environment: env,
                message: 'Status ok'
            });
        }
    );
};