import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import "./Profile.css";
import { useNavigate, useParams } from "react-router-dom";
import ProjectCard from "../../components/project/ProjectCard";
import useAuthStore from "../../store";
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [Projects, setProjects] = useState([]);
    const currentUser = useAuthStore(state => state.username);
    const { username } = useParams();

    useEffect(() => {
        axios.get(`/profile/${username}`, { withCredentials: true })
            .then(response => {
                const socialLinks = JSON.parse(response.data.social_accounts || '{}');
                setProfile({
                    avatar_url: response.data.avatar_url,
                    name: response.data.username,
                    bio: response.data.biography,
                    social: socialLinks
                });
                return axios.get(`/projects/${username}`);
            })
            .then(response => setProjects(response.data))
            .catch(console.error);
    }, [username]);

    const handleDeleteProject = (projectId) => {
        axios.delete(`/project/${projectId}`, { withCredentials: true })
            .then(() => {
                setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
            })
            .catch(console.error);
    };

    return (
        <div className="mypage">
            <div className="mypage-container">
                <div className="profile-section">
                    <img src={profile.avatar_url} alt="User Avatar" className="profile-avatar" />
                    <div className="profile-overview">

                    <div className="profile-info">
                        <h2>{profile.name}</h2>
                        <p>{profile.bio}</p>
                    </div>
                    <div className="profile-social">
                      <p>social accounts</p>
                    {profile.social && (
                            <>
                                {profile.social.facebook && (
                                    <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer" className="setting-facebook">
                                        <FontAwesomeIcon icon={faFacebook} />
                                    </a>
                                )}
                                {profile.social.twitter && (
                                    <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="setting-twitter">
                                        <FontAwesomeIcon icon={faTwitter} />
                                    </a>
                                )}
                                {profile.social.instagram && (
                                    <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer" className="setting-instagram">
                                        <FontAwesomeIcon icon={faInstagram} />
                                    </a>
                                )}
                            </>
                        )}
                    </div>
                    </div>
                </div>

            </div>

            <section className="project-list">
                <div className="list-container">
                    {Projects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            isOwner={currentUser === username}
                            onDelete={handleDeleteProject}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Profile;
