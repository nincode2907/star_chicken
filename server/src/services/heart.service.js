'use strict';

const { InternalError } = require("../core/response/error.response");
const heartModel = require("../models/heart.model");

class HeartService {
    static async started () {
        const data = await heartModel.find({ "Page": { "$in": [1, 2] } });
        if (!data) {
            throw new InternalError("Couldn't find any data! Please try again later.");
        }
        return {
            status: 200,
            message: "Success",
            code: "success",
            data
        }
    }

    static async search(keyword) {
        const query = {
            $or: [
                { "Doc_No": { "$regex": keyword, "$options": "i" } }, 
                { "Content": { "$regex": keyword, "$options": "i" } }
            ]
        };
        
        if (!isNaN(Number(keyword))) {
            query.$or.push({ "Amount": Number(keyword) }); 
        }

        const start = Date.now(); 

        const totalCount = await heartModel.countDocuments(query);
        const data = await heartModel.find(query).limit(100);
        
        const end = Date.now(); 
        const elapsedTime = (end - start) / 1000 / 2;

        return {
            status: 200,
            message: "Success",
            code: "success",
            metaData: {
                totalCount,
                elapsedTime,
                data
            }
        }
    }
}

module.exports = HeartService;