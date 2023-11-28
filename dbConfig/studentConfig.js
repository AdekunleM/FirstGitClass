const mongoose = require('mongoose');
require('dotenv').config();

const DB = process.env.db
mongoose.connect(DB).then(()=>{
    console.log('Connected to database');
}).catch((err) => {
    console.log (err.message)
})