import React from 'react';
import './ProjectCard.css';
import {useNavigate} from 'react-router-dom';
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState, useEffect} from 'react';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import Tag from '../common/Tag/Tag';

const ProjectCard = ({project, isOwner, onDelete}) => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    let languages = project.language
        ? JSON.parse(project.language)
        : [];
    let displayLanguage = languages.length > 0
        ? languages[0]
        : 'None';

    const goToDetailPage = () => {
        navigate(`/project/${project.id}`);
    };
    const toggleDropdown = (event) => {
        event.stopPropagation();
        setShowDropdown(prevState => !prevState);
    };
    const handleDelete = (event, projectId) => {
        event.stopPropagation(); // 버블링 중지
        onDelete(projectId);
    };
    const handleEdit = (event, projectId) => {
        event.stopPropagation(); // 버블링 중지
        navigate(`/edit/${projectId}`);
    };
    useEffect(() => {
        // Define the function that will run when anywhere in the document is clicked
        const closeDropdown = (event) => {
            // If the dropdown is open, close it
            if (showDropdown) {
                setShowDropdown(false);
            }
        };

        // Add the event listener when the component mounts
        document.addEventListener('click', closeDropdown);

        // Remove the event listener when the component unmounts
        return() => {
            document.removeEventListener('click', closeDropdown);
        };
    }, [showDropdown]); // The effect is dependent on the showDropdown state
    return (
        <div className="project-card" key={project.id} onClick={goToDetailPage}>
            <div className="project-image">
                <img src={project.image_url} alt={project.name}/>
            </div>
            {
                isOwner && <div className="project-option-toggle" onClick={toggleDropdown}>
                        <FontAwesomeIcon icon={faEllipsisV}/>
                    </div>
            }
            {
                isOwner && showDropdown && <ul className="project-option">
                        <li onClick={(e) => handleDelete(e, project.id)}>삭제</li>
                        <li onClick={(e) => handleEdit(e, project.id)}>수정</li>
                    </ul>
            }
            <div className="project-details">
                <div className="project-title">
                    <h2>
                        <FontAwesomeIcon className="project-git" icon={faGithub}/> {project.title}</h2>
                    <Tag text={displayLanguage}></Tag>
                </div>
                <p>{project.description || "No description available."}</p>
                <div className="project-footer">
                    <span className="manufacturer">Made by: {project.username}</span>
                    {/* username 추가 */}
                    <span className="date">Updated at: {new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
