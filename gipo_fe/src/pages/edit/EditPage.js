import React, {useState, useEffect} from "react";
import axios from "../../axiosConfig";
import useAuthStore from "../../store";
import "../upload/UploadPage.css"; // 여기서 스타일을 재사용하거나, 필요하면 별도의 EditPage.css를 만들어서 사용하셔도 됩니다.
import {useNavigate, useParams} from "react-router-dom";
import TagInput from "../../components/common/Tag/TagInput";
import TitleInput from '../../components/common/form/TitleInput'
import DescriptionMarkdown from '../../components/common/form/DescriptionMarkdown'

const EditPage = () => {
    const {projectId} = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        selectedRepo: "",
        title: "",
        language: [],
        tags: [],
        image: null,
        description: ""
    });

    const navigate = useNavigate();
    const username = useAuthStore((state) => state.username);

    const handleChange = (e) => {
        const {name, value, type} = e.target;

        if (type === "file") {
            setFormData(prevState => ({
                ...prevState,
                image: e
                    .target
                    .files[0]
            }));
        } else if (name === "tags" || name === "language") {
            setFormData(prevState => ({
                ...prevState,
                [name]: value.split(",")
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleTagChange = (e, type) => {
        const inputValue = e.target.value;
        if (inputValue.endsWith(',')) {
            setFormData(prevState => ({
                ...prevState,
                [type]: [
                    ...prevState[type],
                    inputValue.slice(0, -1)
                ]
            }));
            e.target.value = '';
        }
    };

    const handleTagDelete = (index, type) => {
        setFormData(prevState => ({
            ...prevState,
            [type]: prevState[type].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const uploadData = new FormData();
        for (const key in formData) {
            if (key === "image" && formData[key]) {
                uploadData.append(key, formData[key], formData[key].name);
            } else if (Array.isArray(formData[key])) {
                formData[key].forEach(item => {
                    uploadData.append(key, item);
                });
            } else {
                uploadData.append(key, formData[key]);
            }
        }

        // Use a different endpoint for updating
        axios
            .post(`/update-project/${projectId}`, uploadData, {withCredentials: true})
            .then(response => {
                console.log("Updated:", response.data);
                navigate("/");
            })
            .catch(error => {
                console.error("Error updating:", error);
            });
    };

    useEffect(() => {
        if (!username) 
            return;
        
        // Load project data Load project data
        axios
            .get(`/api/projects/${projectId}`, {withCredentials: true})
            .then(response => {
                const project = response.data;

                const tags = project.tags
                    ? JSON.parse(project.tags)
                    : [];
                const languages = project.language
                    ? JSON.parse(project.language)
                    : [];
                setFormData({
                    ...project,
                    tags: tags,
                    language: languages
                });

                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching project:", err);
                setError(err);
                setLoading(false);
            });

    }, [username, projectId]);

    if (loading) 
        return <p>Loading...</p>;
    if (error) 
        return <p>Error loading data: {error.message}</p>;
    
    return (
        <div className="upload-container">
            <h1 className="upload-title">프로젝트 수정하기</h1>
            <form onSubmit={handleSubmit} className="upload-form">
                <TitleInput title={formData.title} onChange={handleChange}/>
                
                <DescriptionMarkdown
                    defaultValue={formData.description}
                    onChange={handleChange}/>
                <div className="form-group">
                    <label>이미지 업로드:</label>
                    <input
                        name="image"
                        type="file"
                        onChange={handleChange}
                        className="form-input-file"/>
                </div>
                <div className="form-group">
                    <label>언어:</label>
                    <TagInput
                        tags={formData.language}
                        type="language"
                        handleTagChange={handleTagChange}
                        handleTagDelete={handleTagDelete}/>
                </div>
                <div className="form-group">
                    <label>태그:</label>
                    <TagInput
                        tags={formData.tags}
                        type="tags"
                        handleTagChange={handleTagChange}
                        handleTagDelete={handleTagDelete}/>
                </div>
                <div className="form-group">
                    <button type="submit" className="form-button">
                        수정하기
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPage;
