const verifyRoles = (req, res, next) => {
  const isAdmin = req.user.role === "admin";
  const isManager = req.user.role === "manager";

  if (!isAdmin || !isManager) {
    return res
      .status(401)
      .json({ message: "Access denied, only admin or manager can access" });
  }
  next();
};

export default verifyRoles;