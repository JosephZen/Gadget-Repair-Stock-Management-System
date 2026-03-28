export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user; // Set user for controllers
        return next();
    }
    res.status(401).json({ success: false, message: 'Unauthorized access. Please log in.' });
};
