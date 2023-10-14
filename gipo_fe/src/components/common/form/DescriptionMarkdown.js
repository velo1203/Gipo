import React, { useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import './form.css';
import './DescriptionMarkdown.css'
import axios from 'axios';
const DescriptionMarkdown = ({ defaultValue, onChange }) => {
    const editorRef = useRef(null);
    const uploadImageToServer = async (blob) => {
        const formData = new FormData();
        formData.append('image', blob);
        
        const response = await axios.post('/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true, // 쿠키나 기본 인증 정보를 보내기 위한 설정
        });
        
        return response.data.imageUrl;
    };
    
    const handleAddImageBlobHook = (blob, callback) => {
        uploadImageToServer(blob)
            .then(url => {
                callback(url, 'alt text'); // 삽입될 이미지의 alt 텍스트
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    };
    // 내용이 변경될 때마다 호출되는 함수
    const handleEditorChange = () => {
        if (onChange) {
            const editorInstance = editorRef.current.getInstance();
            const content = editorInstance.getMarkdown();

            // 부모 컴포넌트로 값 전달
            onChange({
                target: {
                    name: "description",
                    value: content
                }
            });
        }
    };

    return (
        <div className="form-group">
            <div className='markdown-container'>
                <h1 className='markdown-title'>Description.md 작성</h1>
                <div className='markdown-editor'>

                <Editor
                    
                    previewStyle="vertical"
                    height="400px"
                    initialEditType="markdown"
                    initialValue={defaultValue}
                    ref={editorRef}
                    onChange={handleEditorChange}
                    hideModeSwitch={true}
                    hooks={{
                        addImageBlobHook: handleAddImageBlobHook
                    }}
                />
                </div>
            </div>
        </div>
    );
};

export default DescriptionMarkdown;
