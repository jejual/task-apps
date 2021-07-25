'use strict';

function removeNullKey (obj) {
    Object.keys(obj).forEach(function (key) {
        (obj[key] && typeof obj[key] === 'object') && removeNullKey(obj[key]) ||
        (obj[key] === '' || obj[key] === null) && delete obj[key];
    });
    return obj;
}

module.exports = {
    removeNullKey: removeNullKey
};