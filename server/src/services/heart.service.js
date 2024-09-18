'use strict';

const { InternalError } = require("../core/response/error.response");
const heartModel = require("../models/heart.model");
const sourceModel = require("../models/source.model");

class HeartService {
    static async started (page = 1) {
        const limit = 100;
        const skip = (page - 1) * limit;
        const data = await heartModel.find({ "Page": { "$in": [1, 2] } }).populate('Source', 'title').skip(skip).limit(limit);
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

    static async search(keyword, page = 1) {
        keyword = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const query = {
            $or: [
                { "Doc_No": { "$regex": keyword, "$options": "i" } }, 
                { "Content": { "$regex": keyword, "$options": "i" } }
            ]
        };
        
        if (!isNaN(Number(keyword))) {
            query.$or.push({ "Amount": Number(keyword) }); 
        }

        const limit = 100;
        const skip = (page - 1) * limit;

        const start = Date.now(); 

        const totalCount = await heartModel.countDocuments(query);
        const data = await heartModel.find(query).populate('Source', 'title').skip(skip).limit(limit);
        
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

    static async create() {
        const isDisible = true;
        if (isDisible) {
            throw new InternalError("This feature is disabled!");
        }
        
        const data = {
            "title": "Vietinbank (10-12/09)",
            "description": "Danh sách sao kê ủng hộ đồng bào miền Bắc của MTTQ VN ngân hàng VIETINBANK từ 10/9/2024 đến 12/9/2024 (bao gồm 2.009 trang).",
            "url": "https://cdn.thuvienphapluat.vn/uploads/laodongtienluong/20230301/LA/12.9.2024/ung-ho-mttq-viet-nam-vietinbank.pdf"
        };

        const response = await sourceModel.create(data);
        if (!response) {
            throw new InternalError("Couldn't create new data! Please try again later.");
        }
        return {
            status: 200,
            message: "Success",
            code: "success",
            data: response
        }
    }
}

module.exports = HeartService;