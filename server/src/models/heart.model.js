'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = "Heart";
const COLLECTION_NAME = "Hearts";

const heartSchema = new mongoose.Schema({
    Date: {
        type: String,
        required: true
    },
    Doc_No: {
        type: String,
        required: true
    },
    Amount: {
        type: Number,
        required: true
    },
    Content: {
        type: String,
    },
    Page: {
        type: Number,
        required: true
    }
},
{
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, heartSchema);