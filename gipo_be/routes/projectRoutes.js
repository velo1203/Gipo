const express = require("express");
const axios = require("axios");
const db = require("../database/database");
const { ensureAuthenticated } = require("../middlewares/middlewares");
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const runQuery = (query, params, res, successMessage) => {
    db.run(query, params, (err) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).send({ message: "Database Error", error: err });
        }
        res.send({ message: successMessage });
    });
};

const fetchFromDB = (query, params, res, successCallback) => {
    db.get(query, params, (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        if (!data) return res.status(404).json({ error: "Data not found" });
        successCallback(data);
    });
};

const fetchAllFromDB = (query, params, res, successCallback) => {
  db.all(query, params, (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      if (!data || data.length === 0) return res.status(404).json({ error: "Data not found" });
      successCallback(data);
  });
};

router.post("/upload-project", ensureAuthenticated, upload.single('image'), async (req, res) => {
    try {
        const { selectedRepo, title, description, tags: rawTags, language: rawLanguage } = req.body;

        const tags = Array.isArray(rawTags) ? rawTags : [rawTags];
        const language = Array.isArray(rawLanguage) ? rawLanguage : [rawLanguage];
        const { username } = req.user;
        const { token } = req.session;

        const repoResponse = await axios.get(`https://api.github.com/repos/${username}/${selectedRepo}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const readmeResponse = await axios.get(`https://api.github.com/repos/${username}/${selectedRepo}/readme`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const repoData = repoResponse.data;
        const readmeContent = Buffer.from(readmeResponse.data.content, 'base64').toString('utf-8');

        const data = {
            repo_id: repoData.id,
            title,
            description,
            html_url: repoData.html_url,
            language: JSON.stringify(language),
            forks_count: repoData.forks_count,
            stargazers_count: repoData.stargazers_count,
            updated_at: repoData.updated_at,
            uploader_id: req.user.github_id,
            repo_name: selectedRepo,
            repositorydata: JSON.stringify(repoData),
            readme_content: readmeContent,
            tags: JSON.stringify(tags),
            image_url: req.file ? `http://localhost:8080/uploads/${req.file.filename}` : repoData.owner.avatar_url
        };

        const columns = Object.keys(data);
        const values = columns.map(col => data[col]);
        const query = `INSERT INTO projects (${columns.join(", ")}) VALUES (${values.map(() => "?").join(", ")});`;

        runQuery(query, values, res, "Successfully uploaded!");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.delete("/project/:projectId", ensureAuthenticated, (req, res) => {
    const { projectId } = req.params;
    fetchFromDB("SELECT * FROM projects WHERE id = ?", [projectId], res, (project) => {
        if (Number(req.user.github_id) !== project.uploader_id) {
            return res.status(403).json({
                error: "Permission Denied. You are not the owner of this project.",
            });
        }
        runQuery("DELETE FROM projects WHERE id = ?", [projectId], res, "Project successfully deleted!");
    });
});

router.post('/update-project/:projectId', ensureAuthenticated, upload.single('image'), (req, res) => {
    const { projectId } = req.params;
    fetchFromDB("SELECT * FROM projects WHERE id = ?", [projectId], res, (project) => {
        if (Number(req.user.github_id) !== project.uploader_id) {
            return res.status(403).json({ error: "Permission Denied. You are not the owner of this project." });
        }

        const { title, description, tags: rawTags, language: rawLanguage } = req.body;

        const tags = Array.isArray(rawTags) ? rawTags : [rawTags];
        const language = Array.isArray(rawLanguage) ? rawLanguage : [rawLanguage];
        const imageUrl = req.file ? `http://localhost:8080/uploads/${req.file.filename}` : project.image_url;

        const updateQuery = `
          UPDATE projects
          SET title = ?, description = ?, language = ?, tags = ?, image_url = ?
          WHERE id = ?
        `;

        runQuery(updateQuery, [title, description, JSON.stringify(language), JSON.stringify(tags), imageUrl, projectId], res, "Project successfully updated!");
    });
});

router.get("/projects/:username", (req, res) => {
  const { username } = req.params;
  fetchFromDB("SELECT github_id FROM users WHERE username = ?", [username], res, (user) => {
      fetchAllFromDB("SELECT * FROM projects WHERE uploader_id = ?", [user.github_id], res, (projects) => {
          res.json(projects);
      });
  });
});

router.get("/api/projects", (req, res) => {
  let baseQuery = `SELECT projects.*, users.username FROM projects JOIN users ON projects.uploader_id = users.github_id`;
  let queryParams = [];
  if (req.query.search) {
      const searchToken = `%${req.query.search}%`;
      baseQuery += ` WHERE (projects.title LIKE ? OR projects.tags LIKE ? OR projects.language LIKE ?)`;
      queryParams.push(searchToken, searchToken, searchToken);
  }
  fetchAllFromDB(baseQuery, queryParams, res, (rows) => {
      res.json(rows);
  });
});

router.get("/api/my-projects", (req, res) => {
  const { github_id } = req.user;
  if (!github_id) return res.status(401).send("Not Authenticated");
  fetchAllFromDB("SELECT * FROM projects WHERE uploader_id = ?", [github_id], res, (rows) => {
      res.json(rows);
  });
});

router.get("/api/projects/:projectId", (req, res) => {
  const { projectId } = req.params;
  const query = `SELECT projects.*, users.username FROM projects JOIN users ON projects.uploader_id = users.github_id WHERE projects.id = ?;`;
  fetchFromDB(query, [projectId], res, (row) => {
      res.json(row);
  });
});


router.post("/upload-image", ensureAuthenticated, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: "Image file is required." });
    }
    console.log('ㅁㄴㅇㄹ')
    
    // 이미지 파일의 URL 반환 (로컬 환경에서의 URL 예제입니다. 실제 배포 환경에서는 도메인 주소를 변경해야 합니다.)
    res.send({ imageUrl: `http://localhost:8080/uploads/${req.file.filename}` });
});



module.exports = router;