const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect('/signin');
    } else {
        next();
    }
};

module.exports = withAuth;