import React from 'react';
import './form.css'
const TitleInput = ({ title, onChange }) => (
    <div className="form-group">
        <input
            name="title"
            type="text"
            value={title}
            onChange={onChange}
            placeholder="제목을 입력하세요"
            className="form-element"/>
    </div>
);

export default TitleInput;
