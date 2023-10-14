const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const db = require('../database/database');

// .env 파일 로드
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './', '.env') });


// Passport에서 GitHub 로그인 전략을 사용하도록 설정
passport.use(new GitHubStrategy({
    // GitHub OAuth 2.0 응용 프로그램의 설정 정보
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['repo']
},  function (accessToken, refreshToken, profile, cb) {
    // 사용자가 GitHub에서 로그인한 후 호출되는 콜백 함수
    
    // 데이터베이스에서 사용자의 GitHub ID를 사용하여 사용자를 검색
    db.get('SELECT * FROM users WHERE github_id = ?', [profile.id], (err, row) => {
        if (err) 
            return cb(err);  // 에러 발생시 에러를 반환
        
        if (row) {
            // 사용자가 이미 데이터베이스에 존재하는 경우
            // 토큰을 업데이트하기 위해 데이터베이스에 쿼리
            db.run('UPDATE users SET token = ? WHERE github_id = ?', [
                accessToken, profile.id
            ], (updateErr) => {
                if (updateErr) 
                    return cb(updateErr);  // 에러 발생시 에러를 반환
                
                row.token = accessToken; // 사용자 객체에 토큰을 업데이트
                return cb(null, row);  // 에러 없이 사용자 객체를 반환
            });
        } else {
            // 사용자가 데이터베이스에 존재하지 않는 경우 새 사용자를 추가
            db.run(
                'INSERT INTO users (github_id, username, avatar_url, token) VALUES (?, ?, ?, ?)',
                [
                    profile.id, 
                    profile.username, 
                    profile.photos[0].value, 
                    accessToken  // 토큰 저장
                ],
                function (err) {
                    if (err) 
                        return cb(err);  // 에러 발생시 에러를 반환
                    
                    // 새로 추가된 사용자의 정보를 가져옴
                    db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, newUser) => {
                        if (err) 
                            return cb(err);  // 에러 발생시 에러를 반환
                        
                        newUser.token = accessToken;
                        return cb(null, newUser);  // 에러 없이 새 사용자 객체를 반환
                    });
                }
            );
        }
    });
}));

// 사용자 객체를 세션에 저장하기 위한 serialize 함수
passport.serializeUser((user, done) => {
    done(null, user.id);  // 사용자의 ID만 세션에 저장
});

// 세션에서 사용자 객체를 가져오기 위한 deserialize 함수
passport.deserializeUser((id, done) => {
    // 사용자 ID를 사용하여 데이터베이스에서 사용자 정보를 검색
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        if (err) 
            return done(err);  // 에러 발생시 에러를 반환
        
        done(null, user);  // 에러 없이 사용자 객체를 반환
    });
});

module.exports = passport;  // 설정된 passport 객체를 내보냄
