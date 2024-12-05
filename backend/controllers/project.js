const pool = require("../db");
const queries = require("../queries/project");
const { v4: uuidv4 } = require("uuid");
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const getAllProjects = async (req, resp) => {
  try {
    if (!req.user || !req.user.id) {
      return resp.status(401).json({ message: "Unauthorized access" });
    }

    const results = await pool.query(queries.getAllProjects, [req.user.username]);


    return resp.status(200).json(results.rows);
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const addProject = async (req, resp) => {
  const { projectName } = req.body;

  if (!projectName) {
    return resp.status(400).json({ message: "Project name is required." });
  }

  try {
    const projectId = uuidv4();

    // Insert the project details
    await pool.query(queries.addProjects, [
      projectId,
      req.user.username,
      projectName,
    ]);

    // Associate the project with the owner
    await pool.query(queries.addProjectOwners, [projectId, req.user.username, true]);

    // Create the initial file tree structure for the project
    const fileTreeId = uuidv4();
    await pool.query(queries.addFileTree, [
      fileTreeId,
      projectId,
      null, // Root directory (or null for no parent)
      projectName,
      true, // Indicates that this is a directory (root)
    ]);

    const { rows } = await pool.query(queries.getAllProjects, [req.user.username]);

    return resp
      .status(201)
      .json({ project_id: projectId, message: "Project added successfully.", projects: rows });
  } catch (error) {
    console.log(error);
    return resp.status(500).json({ message: "Internal Server Error." });
  }
};

const getAllFiles = async (req, resp) => {
  if (!req.query.projectId) {
    return resp.status(400).json({ message: "Project ID is required" });
  }

  try {
    await pool.query(queries.makeAllActiveFilesToLive, [req.user.username]);

    const results = await pool.query(queries.getAllFiles, [
      req.query.projectId,
    ]);

    return resp.status(200).json(results.rows);
  } catch (err) {
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const createANewFile = async (req, resp) => {
  const { newFile, extension, projectId } = req.body;

  if (!newFile) {
    return resp.status(400).json({ message: "newFile name is required" });
  }

  try {
    const uniqueId = uuidv4();
    const results = await pool.query(queries.createANewFile, [
      uniqueId,
      projectId,
      req.user.username,
      newFile,
      extension,
    ]);

    return resp.status(200).json({ message: "File Created Successfully" });
  } catch (err) {
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getProjectName = async (req, resp) => {
  try {
    const results = await pool.query(queries.getProjectName, [
      req.query.projectId,
      req.user.username,
    ]);

    return resp.status(200).json(results.rows[0]);
  } catch (err) {
    console.log(err);
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const addContributor = async (req, resp) => {
  const { projectId, contributors } = req.body;
  try {
    for (const contributor of contributors) {
      await pool.query(queries.addContributor, [projectId, contributor.username]);
    }

    return resp.status(200).json({ message: "Added contributors" });
  } catch (err) {
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllActiveFiles = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllActiveFiles, [
      req.user.username,
    ]);

    return resp.status(200).json(results.rows);
  } catch (err) {
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getFileTree = async (req, resp) => {
  try {
    const results = await pool.query(queries.getFileTree, [
      req.query.projectId,
      req.user.id,
    ]);

    return resp.status(200).json(results.rows);
  } catch (err) {
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getInitialTabs = async (req, resp) => {
  try {
    await pool.query(queries.setAllFilesLive, [
      req.user.username,
      req.query.projectId,
    ]);

    const results = await pool.query(queries.getInitialTabs, [
      req.user.username,
      req.query.projectId,
    ]);

    return resp.status(200).json(results.rows);
  } catch (err) {
    return resp.status(500).json({ message: "Internal Server Error" });
  }
};

const setExpandData = async (req, resp) => {
  const { file_tree_id, expand } = req.body;
  if (expand) {
    try {
      await pool.query(queries.insertExpandData, [req.user.id, file_tree_id]);

      return resp.status(200).json({ message: "Update expand" });
    } catch (err) {
      return resp.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    try {
      await pool.query(queries.deleteExpandData, [req.user.id, file_tree_id]);

      return resp.status(200).json({ message: "DELETED expand" });
    } catch (err) {
      return resp.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const userSearch = async (req, res) => {
  const { q, projectId } = req.query; // Get the search term from query
  try {
    const result = await pool.query(
      queries.userSearch,
      [`%${q}%`, projectId] // Exclude the current user's username
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getLogs = async (req, res) => {
  const { file_id } = req.query;
  try {
    const result = await pool.query(queries.getLogs, [file_id]);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  const { project_id } = req.query;
  try {
    const result = await pool.query(queries.getMessages, [project_id]);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const saveFile = async (req, res) => {
  const { file_id, content } = req.body;
  const jsonContent = JSON.stringify({ content });
  try {
    await pool.query(queries.saveFile, [file_id, jsonContent]);
    return res.status(200).json({ message: "File saved successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getInitialContentOfFile = async (req, res) => {
  try {
    const { file_id } = req.query;

    if (!file_id) {
      return res.status(400).json({ message: "Field are required!" });
    }

    const result = await pool.query(queries.getInitialContentOfFile, [file_id]);
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProjectName = async (req, res) => {
  try {
    const { project_id, project_name } = req.body;

    if (!project_id || !project_name) {
      return res.status(400).json({ message: "Field are required!" });
    }

    await pool.query(queries.updateProjectName, [req.user.username, project_id, project_name]);

    return res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const executeCode = async (req, res) => {
  const {
    language = "javascript",
    version = "18.15.0",
    sourceCode = "",
    codeInput = ""
  } = req.body;


  const data = {
    language: language,
    version: version,
    files: [
      {
        content: sourceCode,
      },
    ],
    stdin: codeInput,
  }

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const results = await response.json();
    return res.status(200).json(results.run);

  } catch (error) {
    return res.status(500).json({ message: "Execution Failed" });
  }

};

const deleteProjectContributor = async (req, res) => {
  const { project_id, is_admin } = req.body;
  try {
    if (is_admin) {
      await pool.query(queries.deleteLiveUsers, [project_id]);
      await pool.query(queries.deleteFileTreeExpandUser, [project_id]);
      await pool.query(queries.deleteLogs, [project_id]);
      await pool.query(queries.deleteChat, [project_id]);
      await pool.query(queries.deleteFileTree, [project_id]);
      await pool.query(queries.deleteFiles, [project_id]);
      await pool.query(queries.deleteProjectOwners, [project_id]);
      await pool.query(queries.deleteProjects, [project_id]);
    } else {
      await pool.query(queries.deleteProjectContributor, [project_id, req.user.username]);
    }

    const { rows } = await pool.query(queries.getAllProjects, [req.user.username]);
    return res.status(200).json({ message: "Project Deleted Successfully", projects: rows });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const changeAdmin = async (req, res) => {
  const { project_id, username } = req.body;
  try {
    await pool.query(queries.addContributor, [project_id, username]);
    await pool.query(queries.changeAdmin, [project_id, username, true]);
    await pool.query(queries.changeAdmin, [project_id, req.user.username, false]);

    const { rows } = await pool.query(queries.getAllProjects, [req.user.username]);
    return res.status(200).json({ message: "Admin changed successfully", projects: rows });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const userSearchMakeAdmin = async (req, res) => {
  const { q } = req.query; // Get the search term from query
  try {
    const result = await pool.query(queries.userSearchMakeAdmin, [`%${q}%`, req.user.username]); // Exclude the current user's username
    return res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const exportProject = async (req, res) => {
  try {
    const { project_id } = req.query;

    // Fetch the file-folder structure from the database
    const result = await pool.query(queries.exportProject, [project_id]);

    // Create a map to store files and folders by their file_tree_id
    const fileMap = new Map();
    // Build the tree structure
    const tree = [];

    // First, loop through all rows and add them to the fileMap
    result.rows.forEach((row) => {
      // Create the file/folder item
      const item = {
        file_tree_id: row.file_tree_id,
        parent_id: row.parent_id,
        name: row.name,
        is_folder: row.is_folder,
        file_id: row.file_id,
        file_name: row.file_name,
        file_extension: row.file_extension,
        file_data: row.file_data,
        children: [] // Initialize an empty array for children
      };

      // Store the item in the map
      fileMap.set(row.file_tree_id, item);

      // If the parent_id is null, it's a root item, so add to the tree
      if (!row.parent_id) {
        tree.push(item);
      }
    });

    // Second, loop through the rows again and build the hierarchy
    result.rows.forEach((row) => {
      if (row.parent_id) {
        // Find the parent item and add the current item as its child
        const parentItem = fileMap.get(row.parent_id);
        const childItem = fileMap.get(row.file_tree_id);
        parentItem.children.push(childItem);
      }
    });

    // // Now, the `tree` contains the hierarchical file/folder structure
    // console.log('File Tree Structure:', JSON.stringify(tree, null, 2));

    // Initialize zip file
    const zip = archiver('zip', { zlib: { level: 9 } });
    const zipPath = path.join(__dirname, 'file_structure.zip');
    const output = fs.createWriteStream(zipPath);
    zip.pipe(output);

    // Recursive function to add files/folders to zip
    function addToZip(item, parentDir = '') {
      const itemPath = path.join(parentDir, item.name);
      if (item.is_folder) {
        zip.append(Buffer.alloc(0), { name: itemPath + '/' }); // Add empty folder
        item.children.forEach(child => addToZip(child, itemPath)); // Add child items recursively
      } else {
        zip.append(item?.file_data?.content || "", { name: itemPath });
      }
    }

    // Iterate over the root items and add them to the zip
    tree.forEach(item => {
      addToZip(item);
    });

    // Finalize the zip file
    zip.finalize();

    // Send the .zip file to the client
    output.on('close', () => {
      res.download(path.join(__dirname, 'file_structure.zip'), 'file_structure.zip', (err) => {
        if (err) {
          console.error('Error during file download:', err);
        }
        // Once the download is complete, delete the zip file
        fs.unlink(zipPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting the zip file:', unlinkErr);
          } else {
            console.log('Zip file deleted successfully');
          }
        });
      });
    });

  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  getAllProjects,
  addProject,
  getAllFiles,
  createANewFile,
  getProjectName,
  addContributor,
  getAllActiveFiles,
  getFileTree,
  getInitialTabs,
  setExpandData,
  userSearch,
  getLogs,
  getMessages,
  saveFile,
  getInitialContentOfFile,
  updateProjectName,
  executeCode,
  deleteProjectContributor,
  changeAdmin,
  userSearchMakeAdmin,
  exportProject,
};
