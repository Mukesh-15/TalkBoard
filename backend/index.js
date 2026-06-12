require('dotenv').config();
const express = require('express');
const app = express();
const auth = require('./routes/auth');
const connectToMongo = require('./db/db');

connectToMongo();

app.use('/auth', auth);
app.get('/', (req, res) => {
    console.log("working..");
    res.send("working bruh");
});

app.listen(5000, () => {
    console.log("Server runnig..");
});