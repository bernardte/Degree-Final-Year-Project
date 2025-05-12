const verifyRoles = (req, res, next) => {
  const isAdmin = req.user.role === "admin";
  const isSuperAdmin = req.user.role === "superAdmin";;

  if (!isAdmin && !isSuperAdmin) {
    return res
      .status(401)
      .json({ message: "Access denied, only admin or superAdmin can access" });
  }
  next();
};

export default verifyRoles;