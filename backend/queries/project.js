const getAllProjects = `
SELECT p.*, po.*, u.profile_image AS image
FROM
    projects AS p
JOIN
    project_owners AS po
ON
    p.project_id = po.project_id
JOIN
    users AS u
ON
    p.project_created_by = u.username
WHERE
    po.username = $1
ORDER BY
    po.last_opened DESC;
`;

const addProjects = `
INSERT INTO projects (
    project_id,
    project_created_by,
    project_name
)
VALUES 
    ($1, $2, $3);
`;

const addProjectOwners = `
INSERT INTO project_owners (
    project_id,
    username,
    is_admin
)
VALUES 
    ($1, $2, $3);
`;

const addFileTree = `
INSERT INTO file_tree (
    file_tree_id,
    project_id,
    parent_id,
    name, 
    is_folder
)
VALUES 
    ($1, $2, $3, $4, $5);
`;

const addFileTreeUser = `
INSERT INTO file_tree_user (
    user_id,
    file_tree_id,
    is_expand
)
VALUES 
    ($1, $2, $3);`;

const makeAllActiveFilesToLive = `
UPDATE live_users 
SET is_live = TRUE 
WHERE username = $1;
`;

const getAllFiles = `
WITH file_data AS (
    SELECT
        f.file_id,
        f.file_created_by,
        f.file_data,
        f.file_extension,
        f.file_name,
        f.file_timestamp,
        f.file_id AS id,
        f.project_id,
        COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'is_active_in_tab', lu.is_active_in_tab,
                    'is_live', lu.is_live,
                    'live_users_timestamp', lu.live_users_timestamp,
                    'username', lu.username
                )
            ) FILTER (WHERE lu.username IS NOT NULL),
            '[]'
        ) AS users
    FROM
        files f
    LEFT JOIN
        live_users lu ON f.file_id = lu.file_id
    WHERE
        f.project_id = $1
    GROUP BY
        f.file_id
)
SELECT * FROM file_data;
`;
// SELECT f.*, lu.*, f.file_id AS id FROM files AS f LEFT JOIN live_users AS lu ON f.file_id = lu.file_id WHERE f.project_id = $1;

const createANewFile = `
INSERT INTO files (
    file_id,
    project_id,
    file_created_by,
    file_name,
    file_extension
)
VALUES 
    ($1, $2, $3, $4, $5);
`;

const getProjectName = `
SELECT 
  project_name, 
  CASE 
    WHEN project_created_by = $2 THEN TRUE 
    ELSE FALSE 
  END AS is_admin
FROM 
  projects 
WHERE 
  project_id = $1;
`;

const getContributorId = `
SELECT id FROM users WHERE username = $1;
`;

const addContributor = `
INSERT INTO project_owners (
    project_id,
    username
)
VALUES 
    ($1, $2);
`;

const getAllActiveFiles = `
SELECT f.*, af.is_active_in_tab
FROM active_files AS af
JOIN files AS f ON af.file_id = f.file_id
WHERE af.username = $1;
`;

// const getFileTree = `
// SELECT * FROM file_tree WHERE project_id = $1;
// `;

const getFileTree = `
SELECT 
  ft.file_tree_id, 
  ft.parent_id, 
  ft.name, 
  ft.is_folder, 
  ft.file_tree_timestamp,
  fteu.user_id,
  CASE 
    WHEN fteu.user_id IS NULL THEN false 
    ELSE true 
  END AS expand
FROM 
  file_tree AS ft 
LEFT JOIN 
  (SELECT * FROM file_tree_expand_user WHERE user_id = $2) AS fteu 
ON 
  ft.file_tree_id = fteu.file_tree_id
WHERE 
  ft.project_id = $1;
`;

const setAllFilesLive = `
UPDATE live_users 
SET is_live = TRUE 
WHERE username = $1 AND project_id = $2;
`;

const getInitialTabs = `
SELECT lu.*, f.*, u.profile_image AS image FROM live_users AS lu 
JOIN users AS u
ON lu.username = u.username
JOIN files AS f 
ON lu.file_id = f.file_id 
WHERE lu.username = $1 AND lu.project_id = $2;
`;

const getLiveUsers = `
SELECT u.username, u.profile_image AS image
FROM project_live_users AS plu
JOIN users AS u
ON plu.username = u.username
WHERE project_id = $1;
`;

const insertExpandData = `
  INSERT INTO file_tree_expand_user (user_id, file_tree_id)
  VALUES ($1, $2)
  ON CONFLICT (user_id, file_tree_id) DO NOTHING;
`;

const deleteExpandData = `
  DELETE FROM file_tree_expand_user WHERE user_id = $1 AND file_tree_id = $2;
`;

const userSearch = `
SELECT * FROM users 
WHERE (username ILIKE $1)
AND username NOT IN (
    SELECT username FROM project_owners WHERE project_id = $2
)
`;

const getLogs = `
WITH LatestLogs AS (
    SELECT l.*, u.profile_image AS image 
    FROM logs AS l
    JOIN users AS u 
    ON l.username = u.username
    WHERE file_id = $1
    ORDER BY l.logs_timestamp DESC
    LIMIT 15
)
SELECT * FROM LatestLogs
ORDER BY logs_timestamp ASC;
`;

const getMessages = `   
SELECT c.*, u.profile_image AS image FROM chat AS c JOIN users AS u ON c.username = u.username WHERE project_id = $1;
`;

const saveFile = `
UPDATE files 
SET file_data = $2
WHERE file_id = $1;
`;

const getInitialContentOfFile = `
SELECT file_data FROM files WHERE file_id = $1;
`;

const updateProjectName = `
UPDATE projects 
SET project_name = $3
WHERE project_created_by = $1 AND project_id = $2;
`;

module.exports = {
    getAllProjects,
    addProjects,
    addProjectOwners,
    makeAllActiveFilesToLive,
    getAllFiles,
    createANewFile,
    getProjectName,
    getContributorId,
    addContributor,
    getAllActiveFiles,
    addFileTree,
    addFileTreeUser,
    getFileTree,
    getInitialTabs,
    setAllFilesLive,
    getLiveUsers,
    insertExpandData,
    deleteExpandData,
    userSearch,
    getLogs,
    getMessages,
    saveFile,
    getInitialContentOfFile,
    updateProjectName,
};
