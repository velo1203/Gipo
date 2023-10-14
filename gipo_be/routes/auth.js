const express = require('express');
const passport = require('../config/passportSetup');
const router = express.Router();

//깃허브 인증 관련 라우트

router.get('/auth/github', passport.authenticate('github'));

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err); // 에러를 다음 미들웨어로 전달
        }
        res.status(200).json({ message: "로그아웃됨." }); // 성공적으로 로그아웃한 경우 응답 전송
    });
});


router.get(
    '/auth/github/callback',
    passport.authenticate('github', {failureRedirect: 'http://localhost:3000'}),
    (req, res) => {
        req.session.token = req.user.token; // Here, you save the token in the session.
        res.redirect('http://localhost:3000');
    }
);

module.exports = router;