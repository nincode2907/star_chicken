'use strict';

const { InternalError } = require("../core/response/error.response");
const HeartService = require("../services/heart.service");

class HeartController {
    started = async (req, res) => {
        const { page } = req.query;
        
        const response = await HeartService.started(page);
        if (!response) {
            throw new InternalError();
        }

        return res.status(200).json(response);
    }

    search = async (req, res) => {
        const { q, page } = req.query;
        const response = await HeartService.search(q, page);
        if (!response) {
            throw new InternalError();
        }

        return res.status(200).json(response);
    }

    create = async (req, res) => {
        const response = await HeartService.create();
        if (!response) {
            throw new InternalError();
        }

        return res.status(200).json(response);
    }
}

module.exports = new HeartController;