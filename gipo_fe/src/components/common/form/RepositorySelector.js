import React from 'react';
import './form.css'
const RepositorySelector = ({ repos, selectedRepo, onChange }) => (
    <div className="form-group">
        <select
            name="selectedRepo"
            value={selectedRepo}
            onChange={onChange}
            className="form-element">
            <option value="">레포지토리를 선택하세요</option>
            {
                repos.map((repo) => (
                    <option key={repo.id} value={repo.name}>
                        {repo.private ? ' (private)' : ''} {repo.name}
                    </option>
                ))
            }
        </select>
    </div>
);

export default RepositorySelector;
