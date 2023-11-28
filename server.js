require('./dbConfig/studentConfig');
const express = require('express');

require('dotenv').config();


const participantRouter = require('./routes/studentRoute');
const app = express();
app.use(express.json());
app.use('/api/participant/', participantRouter)

const port = process.env.port 

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});
