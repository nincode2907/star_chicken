const { db: {host, port, name} } = require('./index.config');

const mongoose = require('mongoose');
const connectionString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor () {
        this.connect()
    }

    connect (type='mongodb') {
        mongoose.connect(connectionString)
        .then(() => {
            console.log('Database connection successful!!!');
        })
        .catch((err) => {
            console.error('Database connection error:: ', err);
        });
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Database();
        }
        return this.instance;
    }
}

const instanceDb = Database.getInstance()
module.exports = instanceDb