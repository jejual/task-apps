'use strict';

module.exports = function (asyncHandler) {
    return function (req, res, next) {
        const response = asyncHandler(req);

        response
            .then(function (response) {
                res.status(200).json(response);
            })
            .catch(function (err) {
                res.status(500).json({
                    message: 'Server error. Something unexpected is happening. We are on it!',
                    ...err
                });
            });
    };
};
