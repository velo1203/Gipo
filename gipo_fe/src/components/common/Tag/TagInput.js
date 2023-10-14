import './TagInput.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const TagInput = ({ tags, type, handleTagChange, handleTagDelete }) => {
    return (
        <div className="tag-input-container form-element">
            {tags.map((tag, index) => (
                <span key={index} className="tag"  onClick={() => handleTagDelete(index, type)}>
                    {tag}
                    <span className="delete-tag">
                        <FontAwesomeIcon icon={faXmark}/>
                    </span>
                </span>
            ))}
            <input
                name={type}
                type="text"
                onChange={(e) => handleTagChange(e, type)}
                placeholder={type === 'language' ? "언어를 입력 후 쉼표로 구분하세요" : "태그를 입력 후 쉼표로 구분하세요"}
                className="tag-input"
            />
        </div>
    );
}
export default TagInput;

/**
 * <TagInput /> 컴포넌트 사용법:
 * 
 * Props:
 *  - tags: (Array) 태그나 언어 목록을 나타내는 문자열 배열입니다.
 *  - type: (String) "tags" 또는 "language" 중 하나를 입력합니다. 해당 문자열은 placeholder 및 input의 name 값으로 사용됩니다.
 *  - handleTagChange: (Function) 태그 입력 필드에서 값이 변경될 때 호출되는 함수입니다. 
 *                    이 함수는 이벤트 객체와 태그 유형 ("tags" 또는 "language")를 인자로 받아야 합니다.
 *  - handleTagDelete: (Function) 태그 삭제 버튼을 클릭할 때 호출되는 함수입니다. 
 *                    이 함수는 삭제하려는 태그의 인덱스와 태그 유형을 인자로 받아야 합니다.
 * 
 * 사용 예제:
 * 
 * <TagInput 
 *      tags={['JavaScript', 'React']} 
 *      type="language" 
 *      handleTagChange={yourTagChangeHandlerFunction}
 *      handleTagDelete={yourTagDeleteHandlerFunction}
 * />
 * 
 * 위 예제는 "JavaScript"와 "React"라는 두 언어를 태그로 가진 TagInput 컴포넌트를 렌더링합니다.
 */