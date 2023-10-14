const express = require('express');
const axios = require('axios');
const db = require('../database/database');
const {ensureAuthenticated} = require('../middlewares/middlewares');

const router = express.Router();

// 사용자의 GitHub 레포지토리를 가져오는 라우트
router.get('/github/repo/:username', ensureAuthenticated, (req, res) => {
    const { token } = req.session;

    axios
        .get(`https://api.github.com/user/repos?per_page=100`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            res.json(response.data)})
        .catch(error => {
            console.error("Error:", error);
            res
                .status(500)
                .send("Internal Server Error");
        });
});

//사용자의 github 리드미를 가져오는 라우트
router.get(
    '/github/readme/:username/:repo',
    (req, res) => {
        const {username, repo} = req.params;

        // 먼저 해당 사용자의 깃허브 ID를 사용하여 프로젝트를 찾습니다.
        db.get(
            "SELECT github_id FROM users WHERE username = ?",
            [username],
            (err, user) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res
                        .status(500)
                        .send("Internal Server Error");
                }

                if (!user) 
                    return res
                        .status(404)
                        .send("User not found");
                
                // 해당 사용자의 깃허브 ID와 레포 이름을 사용하여 프로젝트를 찾습니다.
                db.get(
                    "SELECT readme_content FROM projects WHERE uploader_id = ? AND repo_name = ?",
                    [
                        user.github_id, repo
                    ],
                    (err, project) => {
                        if (err) {
                            console.error("Database Error:", err);
                            return res
                                .status(500)
                                .send("Internal Server Error");
                        }

                        if (!project) 
                            return res
                                .status(404)
                                .send("Project not found");
                        
                        res.json({readmeText: project.readme_content});
                    }
                );
            }
        );
    }
);



// 현재 로그인한 사용자의 프로필 정보를 가져오는 라우트
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.json({
        isLoggedIn: true,
        ...req.user
    });
});

// 특정 사용자의 프로필 정보를 가져오는 라우트
router.get('/profile/:username', (req, res) => {
    const { username } = req.params;

    db.get('SELECT id, username, avatar_url, biography, social_accounts FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res
                .status(500)
                .json({ error: 'Internal Server Error' });
        }
        if (!user) 
            return res
                .status(404)
                .json({ error: 'User not found' });
        
        res.json(user);
    });
});



router.post('/profile/update', ensureAuthenticated, (req, res) => {
    const { biography, socialLinks } = req.body;
    const user = req.user;
    const { id } = user;


    // Check if the values are not null
    if(!biography || !socialLinks) {
        return res.status(400).json({ error: 'Invalid data provided' });
    }

    // JSON stringifying the social_links for DB storage
    const socialLinksStr = JSON.stringify(socialLinks);

    const query = `
        UPDATE users 
        SET biography = ?, social_accounts = ? 
        WHERE id = ?
    `;

    db.run(query, [biography, socialLinksStr, id], (err) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({ message: 'Profile updated successfully!' });
    });
});



module.exports = router;
