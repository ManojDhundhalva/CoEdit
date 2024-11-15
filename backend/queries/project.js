const getAllProjects = `
SELECT *
FROM
    projects AS p
JOIN
    project_owners AS po
ON
    p.project_id = po.project_id
WHERE
    po.user_id = $1;
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
    user_id,
    is_admin
)
VALUES 
    ($1, $2, TRUE);
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


const getProjectName = `
SELECT project_name FROM projects WHERE project_id = $1;
`;

const getContributorId = `
SELECT id FROM users WHERE username = $1;
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


const getLogs = `
SELECT l.*, u.profile_image AS image FROM logs AS l JOIN users AS u ON l.username = u.username WHERE file_id = $1;
`;


module.exports = {
    getAllProjects,
    addProjects,
    addProjectOwners,
    makeAllActiveFilesToLive,
    getAllFiles,
    getProjectName,
    getContributorId,
    getAllActiveFiles,
    addFileTree,
    addFileTreeUser,
    getFileTree,
    getInitialTabs,
    setAllFilesLive,
    getLiveUsers,
    insertExpandData,
    deleteExpandData,
    getLogs,
};