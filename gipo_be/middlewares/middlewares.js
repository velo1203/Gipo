
//사용자가 인증되었는지 확인하는 미들웨어
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send("Not Authenticated");
}

module.exports = {
    ensureAuthenticated
}