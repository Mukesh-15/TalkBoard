const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const verifyToken = require("../middleware/verifyToken");

router.get('/getUser', verifyToken ,(req, res) => {
    
});