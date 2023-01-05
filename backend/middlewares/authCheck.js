const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(404).json({
      authentication: false,
      message: "User has not been authenticated",
    });
  } else {
    next();
  }
};


module.exports = authCheck;
