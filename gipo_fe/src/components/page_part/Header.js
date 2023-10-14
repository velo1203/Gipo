import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useState } from "react";
import useAuthStore from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userName = useAuthStore((state) => state.username); // 사용자의 깃허브 프로필 이미지 URL
  const userProfileImage = useAuthStore((state) => state.userProfileImage); // 사용자의 깃허브 프로필 이미지 URL
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 메뉴 표시 여부

  const goToLogin = () => {
    navigate("/login");
  };

  const goToProfile = () => {
    navigate(`/profile/${userName}`);
  };
  const goToUpload = () => {
    navigate("/upload");
  };
  const goToSetting = () => {
    navigate("/setting");
  };
//   const handleLogout = async () => {
//     try {
//         // 서버에 로그아웃 요청을 보냅니다.
//         await axios.get("/logout");
        
//         // 서버의 응답을 기다린 후 로그인 상태를 false로 설정합니다.
//         useAuthStore.getState().setIsLoggedIn(false);
        
//         // 로그아웃 후 홈페이지로 이동합니다.
//         navigate("/");
//     } catch (error) {
//         console.error("Error during logout:", error);
//     }
// };

const handleLogout = () => {
  axios.post('/logout', {}, {withCredentials: true}).then(() => {
      useAuthStore.getState().setIsLoggedIn(false);
      navigate("/");
  }).catch((error) => {
      console.error('Error during logout:', error);
  })
};


  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
};

  return (
    <header className="App-header">
      <div className="header-container">
        <h1 className="header-title" onClick={() => navigate("/")}>
          Gipo
        </h1>
        <ul className="header-items">
          <li onClick={() => navigate("/")}>Home</li>
          {isLoggedIn ? (
              <div className="profile-image-container">
                
                <img
                  src={userProfileImage}
                  alt="User Profile"
                  className="profile-image"
                  onClick={toggleDropdown} // 클릭 이벤트 리스너 추가
                />
                <FontAwesomeIcon icon={faSortDown} className="dropdown-icon" onClick={toggleDropdown} />
                {showDropdown && (
                  <ul className="dropdown-menu">
                    <li onClick={handleLogout}>Logout</li>
                    <li onClick={goToProfile}>Mypage</li>
                    <li onClick={goToUpload}>Upload Project</li>
                    <li onClick={goToSetting}>Setting</li>
                  </ul>
                )}
              </div>
          ) : (
            <li onClick={goToLogin}>Login</li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
