import React from 'react';
import './Tag.css';  // Tag에 대한 스타일이 필요하다면 이 파일을 생성하세요.
import { useNavigate } from 'react-router-dom';


const Tag = ({ text,route }) => {
    const navigate = useNavigate()
  return (
    <span className="tag" onClick={()=>{
        navigate(route)
    }}>{text}</span>
  );
};

export default Tag;
