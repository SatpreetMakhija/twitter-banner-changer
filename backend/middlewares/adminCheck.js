
const adminCheck = (req, res, next) => {

    const isAdmin = req.user.isAdmin;
    console.log(isAdmin);
    if (isAdmin) {
      next();
    } else {
      res.status("403").send({errorCode: "NOT_ADMIN"});
    }
  }
module.exports = adminCheck;