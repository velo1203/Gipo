import React from 'react';
import './LoginPage.css';
import GithubButton from '../../components/oauth/GithubButton';
const LoginPage = () => {

    return (
        <div className='login-page'>

            <div className="login-container">
                <h1>기포에 오신것을 환영합니다</h1>
                <p className='login-descriptioaxn'>프로젝트를 쉽게 공유하고 알리세요</p>
                <GithubButton/>

            </div>
        </div>
    );
};

export default LoginPage;
