const authMiddleware = (req, res, next) => {
    console.log("Session data in middleware:", req.session);

    if (!req.session.officerId) {
        return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    next();
};
