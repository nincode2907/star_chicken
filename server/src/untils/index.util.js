'use strict';

const _ = require('lodash');

const getInformationFromObject = ({object, filter = []}) => {
    return _.pick(object, filter);
}

const asyncHanlderError = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = {
    getInformationFromObject,
    asyncHanlderError
}