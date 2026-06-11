const express = require('express');
const app = express();
const auth = require('./routes/auth');

app.use('/auth', auth);
app.get('/', (req, res) => {
    console.log("working..");
    res.send("working bruh");
});

app.listen(5000, () => {
    console.log("Server runnig..");
});