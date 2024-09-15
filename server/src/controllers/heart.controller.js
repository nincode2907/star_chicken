'use strict';

const { InternalError } = require("../core/response/error.response");
const HeartService = require("../services/heart.service");

class HeartController {
    started = async (req, res) => {
        console.log('Received request at /api/v1');
        // console.log('Request headers:', req.headers);
        const response = await HeartService.started();
        if (!response) {
            throw new InternalError();
        }

        return res.status(200).json(response);
    }

    search = async (req, res) => {
        const { q } = req.query;
        const response = await HeartService.search(q);
        if (!response) {
            throw new InternalError();
        }

        return res.status(200).json(response);
    }
}

module.exports = new HeartController;