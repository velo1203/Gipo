import React from "react";
import SearchBar from "../../components/search/SearchBar";
import ProjectCard from "../../components/project/ProjectCard";
import {useState, useEffect} from "react";
import './HomePage.css'
import axios from "../../axiosConfig"

const HomePage = () => {
    const [projects, setProjects] = useState([]);
    const handleSearch = (searchTerm) => {
        axios
            .get(`/api/projects?search=${searchTerm}`)
            .then(response => {
                setProjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });
    };

    

    useEffect(() => {
        // 서버에서 'projects' 데이터 가져오기
        axios
            .get('/api/projects') // 서버의 엔드포인트 경로
            .then((response) => {
                setProjects(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="App">
            <SearchBar onSearch={handleSearch}/>
            <section className="project-list">
                <div className="list-container">
                    {
                        projects.length === 0
                            ? <h1>게시물이 없습니다</h1>
                            : projects.map(
                                (project) => (<ProjectCard key={project.id} project={project}/>)
                            )
                    }
                </div>
            </section>
        </div>
    );
};

export default HomePage;
