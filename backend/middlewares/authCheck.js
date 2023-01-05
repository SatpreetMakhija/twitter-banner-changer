const authCheck = (req, res, next) => {
  if (!req.user) {
    res.json({
      authentication: false,
      message: "User has not been authenticated",
    });
  } else {
    next();
  }
};


module.exports = authCheck;
