'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Source';
const COLLECTION_NAME = 'Sources';

const sourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, sourceSchema);