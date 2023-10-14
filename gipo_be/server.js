// server.js

// 필요한 모듈들을 불러옵니다.
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('./config/passportSetup');

// 라우터 모듈들을 불러옵니다.
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Express 앱을 초기화합니다.
const app = express();
const PORT = 8080;

// CORS 설정을 합니다. 웹 애플리케이션과 API 서버 간의 교차 출처 요청을 허용합니다.
app.use(cors({origin: 'http://localhost:3000', credentials: true}));

// 세션 설정을 합니다. 사용자의 로그인 상태와 같은 정보를 서버의 메모리에 저장합니다.
app.use(session({secret: '123sdf', resave: false, saveUninitialized: true}));

// Passport를 초기화하고, 사용자 세션과 함께 사용합니다.
app.use(passport.initialize());
app.use(passport.session());

// 요청 본문을 JSON 형식으로 파싱합니다.
app.use(bodyParser.json());

// 각각의 라우트 핸들러(라우터 모듈)를 사용합니다.
app.use(authRoutes);
app.use(userRoutes);
app.use(projectRoutes);
app.use('/uploads', express.static('uploads'));

// Express 서버를 시작하고, 지정된 포트에서 실행합니다.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
