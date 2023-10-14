import './App.css'
import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import ProjectDetailPage from './pages/detail/ProjectDetailPage';
import UploadPage from './pages/upload/UploadPage';
import Header from './components/page_part/Header';
import Profile from './pages/profile/Profile';
import EditPage from './pages/edit/EditPage';
import Footer from './components/page_part/Footer'
import useAuthStore from "./store";
import axios from 'axios';
import { useEffect } from 'react';
import UserSetting from './pages/setting/setting';

function App() {
    const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);
    const setUserProfileImage = useAuthStore(state => state.setUserProfileImage);
    const setUsername = useAuthStore(state => state.setUsername);
    const setEmail = useAuthStore(state => state.setEmail);
    const setGithub_id = useAuthStore(state => state.setGithub_id);
    useEffect(() => {
        axios
            .get('/profile', {withCredentials: true})
            .then(response => {
                console.log(response.data)
                setIsLoggedIn(response.data.isLoggedIn);
                if (response.data.isLoggedIn) {
                    setUserProfileImage(response.data.avatar_url);
                    setUsername(response.data.username);
                    setEmail(response.data.email);
                    setGithub_id(response.data.github_id);
                }
            })
            .catch(error => {});
    }, [setIsLoggedIn, setUserProfileImage, setUsername, setEmail, setGithub_id]);
    return (
        <div className="App">
            <BrowserRouter>

                <Header/>
                <Routes>
                    <Route path="/" element={<HomePage />}/>
                    <Route path="/login" element={<LoginPage />}/>
                    <Route path="/setting" element={<UserSetting />}/>
                    <Route path="/project/:projectId" element={<ProjectDetailPage />}/>
                    <Route path='/upload' element={<UploadPage/>}/>
                    <Route path='/edit/:projectId' element={<EditPage/>} />
                    <Route path='/profile/:username' element={<Profile/>} />
                </Routes>
                <Footer/>
            </BrowserRouter>
        </div>

    );
}

export default App;
