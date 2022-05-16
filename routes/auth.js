const express = require("express");
const {register, login, getUser, logout} = require("../controllers/auth.js");
const {getAccessToRoute} = require("../middlewares/authorization/auth.js");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile',  getAccessToRoute, getUser);
router.get('/logout', getAccessToRoute, logout)

module.exports = router;