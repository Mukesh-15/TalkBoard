const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("auth page ki ochinav");
})

module.exports = router;