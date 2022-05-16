const express = require("express");
const auth = require("./auth.js");
const router = express.Router();

router.use('/auth', auth);

module.exports = router;