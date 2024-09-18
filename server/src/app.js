require("dotenv").config();
const express = require('express');
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const app = express();

// const whitelist = {
//     ngrok: 'https://793a-2402-800-63a7-fa47-68dd-507c-cd8d-23eb.ngrok-free.app',
//     localhost: 'http://localhost:3000'
// }
const whitelist = [
    'http://localhost',
    '192.168.1.6',
    '192.168.1.8',
];

// middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// database
require("./core/mongo.database")

// routes
app.use(require("./routes"))

// handlers error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const status = err.status;
    res.status(status).json({
        status: status,
        message: err.message || 'Internal Server Error',
        code: "error"
    })
});

module.exports = app;