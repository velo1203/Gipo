import React, {useState, useEffect} from "react";
import axios from "../../axiosConfig";
import useAuthStore from "../../store";
import "./UploadPage.css";
import {useNavigate} from "react-router-dom";
import TagInput from "../../components/common/Tag/TagInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackward, faForward, faImage} from "@fortawesome/free-solid-svg-icons";
import RepositorySelector from '../../components/common/form/RepositorySelector'
import TitleInput from '../../components/common/form/TitleInput'
import DescriptionMarkdown from '../../components/common/form/DescriptionMarkdown'

const UploadPage = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [step, setStep] = useState(1); // 1단계에서 시작

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

    const handleImageChange = (e) => {
        const file = e
            .target
            .files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            }
            reader.readAsDataURL(file);
        }
        handleChange(e);
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
            } else if (key === "tags" || key === "language") {
                const items = Array.isArray(formData[key]) ? formData[key] : [formData[key]];
                items.forEach(item => {
                    uploadData.append(key, item);
                });
            } else {
                uploadData.append(key, formData[key]);
            }
        }
        axios
            .post("/upload-project", uploadData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                console.log("Success:", response.data);
                navigate("/");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    useEffect(() => {
        if (!username) 
            return;
        
        axios
            .get(`/github/repo/${username}`, {withCredentials: true})
            .then((response) => {
                console.log(response.data)
                setRepos(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching repositories:", err);
                setError(err);
                setLoading(false);
            });
    }, [username]);

    if (loading) 
        return <p>Loading...</p>;
    if (error) 
        return <p>Error loading repositories: {error.message}</p>;
    
    return (
        <div className="upload-container">
            <h1 className="upload-title">
                {
                    step === 1
                        ? "프로젝트 설정"
                        : "프로젝트 내용 구성"
                }
                ({step}/2) {/* 현재 단계에 따른 제목 변경 */}
            </h1>
            <form onSubmit={handleSubmit} className="upload-form">
                {
                    step === 1
                        ? (
                            <> {/* 첫 번째 페이지 내용 */
                            } < RepositorySelector repos = {
                                repos
                            }
                            selectedRepo = {
                                formData.selectedRepo
                            }
                            onChange = {
                                handleChange
                            } /> <TitleInput title={formData.title} onChange={handleChange}/>
                            <div className="form-group">
                                <TagInput
                                    tags={formData.language}
                                    type="language"
                                    handleTagChange={handleTagChange}
                                    handleTagDelete={handleTagDelete}/>
                            </div>
                            <div className="form-group">
                                {
                                    previewImage
                                        ? <img src={previewImage} alt="Preview" className="preview-image"/>
                                        : <label className="image-upload-label">
                                                <input
                                                    name="image"
                                                    type="file"
                                                    onChange={handleImageChange}
                                                    className="form-input-file"
                                                    style={{
                                                        display: 'none'
                                                    }}/>
                                                <div className="image-upload-container">
                                                    <div className="image-upload-box">
                                                        <FontAwesomeIcon icon={faImage} className="image-upload-icon"/>
                                                        <span>사진을 선택하세요</span>

                                                    </div>
                                                </div>
                                            </label>
                                }
                            </div> < div className = "form-group" > <button type="button" className="form-button" onClick={() => setStep(2)}>
                                다음 <FontAwesomeIcon icon={faForward}/>
                            </button>
                        </div>
                    </>
                        )
                        : (
                            <> {/* 두 번째 페이지 내용 */
                            } < DescriptionMarkdown description = {
                                formData.description
                            }
                            onChange = {
                                handleChange
                            } /> <div className="form-group">
                                <TagInput
                                    tags={formData.tags}
                                    type="tags"
                                    handleTagChange={handleTagChange}
                                    handleTagDelete={handleTagDelete}/>
                            </div>
                            <div className="form-group">
                                <div className="form-button-group">
                                    <button
                                        type="button"
                                        className="form-button"
                                        style={{
                                            marginRight: "10px"
                                        }}
                                        onClick={() => setStep(1)}>
                                        <FontAwesomeIcon icon={faBackward}/> 이전
                                    </button>
                                    <button type="submit" className="form-button">
                                        업로드
                                    </button>

                                </div>
                            </div>
                        </>
                        )
                }
            </form>
        </div>
    );

};

export default UploadPage;
