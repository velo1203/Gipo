import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ProjectDetailPage.css';
import Tag from '../../components/common/Tag/Tag';
import {Viewer} from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { faLink } from '@fortawesome/free-solid-svg-icons';

const ProjectDetailPage = () => {
    // States
    const [project, setProject] = useState({});
    const [readme, setReadme] = useState('');
    const [isReadmeOpen, setIsReadmeOpen] = useState(false);
    const {projectId} = useParams();
    const nvigate = useNavigate()
    const tags = project.tags
        ? JSON.parse(project.tags)
        : [];
    const languages = project.language
        ? JSON.parse(project.language)
        : [];

    // Fetch project details
    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/projects/${projectId}`)
            .then(response => setProject(response.data));
    }, [projectId]);

    // Fetch README from GitHub when project details are updated
    useEffect(() => {
        const repoOwner = project.username;
        const repoName = project.repo_name;

        if (repoOwner && repoName) {
            // 백엔드 서버에 요청을 보냅니다.
            axios
                .get(
                    `http://localhost:8080/github/readme/${repoOwner}/${repoName}`,
                    {withCredentials: true}
                )
                .then(response => {
                    setReadme(response.data.readmeText);
                })
                .catch(error => console.error(error));
        }
    }, [project]);

    // Handlers and utilities
    const toggleReadme = () => setIsReadmeOpen(prevState => !prevState);

    const OnProfileClick = () => {
        nvigate(`/profile/${project.username}`)
    }

    // JSX rendering
    return (
        <div className='project-detail-page'>
            <div className='detail-container'>
                <div className='detail-header'>
                    <div className="detail-title">
                        <h1>{project.title}</h1>
                        <p className="detail-author" onClick={OnProfileClick}>By {project.username}</p>
                    </div>
                    {console.log(project.description)}
                    <p className="detail-description">
                        {
                            project.description
                                ? <Viewer initialValue={project.description} height="400px"/>
                                : "No description available."
                        }
                    </p>

                    <p className="detail-info">
                        <a
                            href={project.html_url}
                            className="detail-link"
                            target="_blank"
                            rel="noopener noreferrer">
                            깃허브에서 보기 <FontAwesomeIcon icon={faLink}/>
                        </a>
                    </p>
                    <div className="detail-info">해시태그 {Array.isArray(tags) && tags.map((tag, i) => (<Tag key={i} text={tag}/>))}

                    </div>
                    <p className="detail-info">사용된 언어: {
                            Array.isArray(languages) && languages.map(
                                (language, i) => (<Tag key={i} text={language}/>)
                            )
                        }
                    </p>
                </div>
                <div className='detail-documentation'>
                    <h2 className="section-title" onClick={toggleReadme}>README.MD 📄</h2>
                    <div className='read-me'>
                        {isReadmeOpen && (<Viewer initialValue={readme} height="400px"/>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
