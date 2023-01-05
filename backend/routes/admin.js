const express = require('express');
const router = express.Router();
const adminCheck = require('../middlewares/adminCheck');
const authCheck = require('../middlewares/authCheck');
const agenda = require('../utils/agenda');
const Agendash = require('agendash');
router.get("/", authCheck, adminCheck, (req, res, next) => {
    res.json({message: "user is admin."});
})




module.exports = router;




