const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Otp = require('../models/Otps');
const jwt = require('jsonwebtoken');

router.post('/signin', async (req, res) => {
    try{
        
    }catch(error){
        res.send(error); // remove later
    }

    res.send("auth page ki ochinav");
})

router.post('/signup', async (req, res) => {

})

module.exports = router;