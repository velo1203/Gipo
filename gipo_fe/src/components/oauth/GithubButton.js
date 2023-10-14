import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const GithubButton  = (props) => {
    const clientId = '3a901892481ce0cbae9f';
    const redirectUrl = 'http://localhost:8080/auth/github/callback';
    const scope = 'repo'; // private 저장소에 대한 접근 권한 요청
    const githubURL = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}`;
    
    const handleLogin = ()=>{
        window.location.href = githubURL
    }
    return (
        <div >
            <button onClick={handleLogin} className="github-login-btn" >
            <FontAwesomeIcon icon={faGithub} className='app-logo'/> Login with GitHub
            </button>
        </div>
    );
};

export default GithubButton
