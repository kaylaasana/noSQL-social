// require mongoose
const mongoose = require('mongoose');

// create connection between mongoose and local connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/departmentsDB');

// export mongoose connection
module.exports = mongoose.connection;