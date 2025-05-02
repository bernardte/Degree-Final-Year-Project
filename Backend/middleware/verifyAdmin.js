const verifyAdmin = (req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(401).json({ message: "Access denied, only admin can access" });
    }
    next();
}

export default verifyAdmin;