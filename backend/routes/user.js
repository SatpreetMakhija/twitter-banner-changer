const express = require('express');
const router = express.Router();
const findJobsByUserId = require('../utils/findJobsByUserId');
const authCheck = require('../middlewares/authCheck');
router.get("/jobs", authCheck, async (req, res, next) => {
  const userId = req.user._id;
  const userJobs = await findJobsByUserId(userId, 4);
  res.send({userJobs: userJobs});
});

module.exports = router;
