import React, {useState} from 'react';
import './setting.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFacebook, faInstagram, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {faLink} from '@fortawesome/free-solid-svg-icons';
import axios from '../../axiosConfig';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserSetting = () => {
    const navigate = useNavigate()
    const [profileData, setProfileData] = useState({
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: ''
        },
        biography: ''
    });
    useEffect(() => {
        // 사용자의 현재 프로필 정보를 가져옴
        axios
            .get(`/profile`, { withCredentials: true })
            .then((response) => {
                const userData = response.data;
                
                // social_accounts가 JSON 문자열로 되어 있을 경우 파싱
                const socialLinks = JSON.parse(userData.social_accounts || '{}');
                
                setProfileData({
                    biography: userData.biography || '',
                    socialLinks: {
                        facebook: socialLinks.facebook || '',
                        twitter: socialLinks.twitter || '',
                        instagram: socialLinks.instagram || '',
                    }
                });
            })
            .catch((err) => {
                console.error("Error fetching user profile:", err);
            });
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        if (name in profileData.socialLinks) {
            setProfileData(prevState => ({
                ...prevState,
                socialLinks: {
                    ...prevState.socialLinks,
                    [name]: value
                }
            }));
        } else {
            setProfileData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }
    const saveProfile = async () => {
        try {
            const response = await axios.post('/profile/update', profileData,{withCredentials:true});
            if (response.data.message === 'Profile updated successfully!') {
                navigate('/')
            } else {
                console.error('Error updating profile:', response.data.error);
            }
        } catch (error) {
            console.error('API call failed:', error);
        }
    }

    return (
        <div className="setting-user-profile-page">
            <h2 className='setting-title'>설정</h2>
            <h1 className='setting-section-title'>내 정보</h1>
            <div className="setting-biography">
                <label className='setting-input'>
                    <p>상태메시지</p>
                    <textarea
                        spellCheck='false'
                        name="biography"
                        value={profileData.biography}
                        onChange={handleInputChange}
                        className='form-element setting-status-message'
                        maxLength={40}/>
                </label>
            </div>
            <h1 className='setting-section-title'>소셜 미디어 연동
                <FontAwesomeIcon icon={faLink}/></h1>
            <div className="setting-social-links">
                <label className='setting-input'>
                    <p><FontAwesomeIcon icon={faFacebook} className='setting-facebook'/> Facebook</p>
                    <input
                        type="text"
                        name="facebook"
                        value={profileData.socialLinks.facebook}
                        onChange={handleInputChange}
                        className='form-element'
                        placeholder='https://www.facebook.com'/>
                </label>
                <label className='setting-input'>
                    <p><FontAwesomeIcon icon={faTwitter} className='setting-twitter'/> Twitter</p>
                    <input
                        type="text"
                        name="twitter"
                        value={profileData.socialLinks.twitter}
                        onChange={handleInputChange}
                        placeholder='https://twitter.com'className='form-element'/>
                </label>
                <label className='setting-input'>
                    <p><FontAwesomeIcon icon={faInstagram} className='setting-instagram'/> Instagram</p>
                    <input
                        type="text"
                        name="instagram"
                        value={profileData.socialLinks.instagram}
                        onChange={handleInputChange}
                        className='form-element'
                        placeholder='https://www.instagram.com'/>
                </label>
            </div>

            <button className="setting-save-button form-button" onClick={saveProfile}>프로필 저장</button>
        </div>
    );
}

export default UserSetting;
