module.exports = (req, res, next) => {
    if (!req.session.userAuth) {
        next();
    } else {
        res.redirect("/");
    }
}