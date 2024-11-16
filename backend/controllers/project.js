const pool = require("../db");
const queries = require("../queries/project");
const { v4: uuidv4 } = require("uuid");

const getAllProjects = async (req, resp) => {
  try {
    if (!req.user || !req.user.id) {
      return resp.status(401).json({ message: "Unauthorized access" });
    }

    const results = await pool.query(queries.getAllProjects, [req.user.id]);

    return resp.status(200).json(results.rows);
  } catch (error) {
    console.error("Error retrieving projects:", error);
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
    await pool.query(queries.addProjectOwners, [projectId, req.user.id]);

    // Create the initial file tree structure for the project
    const fileTreeId = uuidv4();
    await pool.query(queries.addFileTree, [
      fileTreeId,
      projectId,
      null, // Root directory (or null for no parent)
      projectName,
      true, // Indicates that this is a directory (root)
    ]);

    return resp
      .status(201)
      .json({ project_id: projectId, message: "Project added successfully." });
  } catch (error) {
    console.error("Error adding project:", error);
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

    resp.status(200).json(results.rows);
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
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

    resp.status(200).json({ message: "File Created Successfully" });
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getProjectName = async (req, resp) => {
  try {
    const results = await pool.query(queries.getProjectName, [
      req.query.projectId,
    ]);

    resp.status(200).json({ project_name: results.rows[0].project_name });
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const addContributor = async (req, resp) => {
  const { projectId, contributors } = req.body;
  try {
    for (const contributor of contributors) {
      await pool.query(queries.addContributor, [projectId, contributor.id]);
    }

    resp.status(200).json({ message: "Added contributors" });
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllActiveFiles = async (req, resp) => {
  try {
    const results = await pool.query(queries.getAllActiveFiles, [
      req.user.username,
    ]);

    resp.status(200).json(results.rows);
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getFileTree = async (req, resp) => {
  try {
    const results = await pool.query(queries.getFileTree, [
      req.query.projectId,
      req.user.id,
    ]);

    resp.status(200).json(results.rows);
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
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

    resp.status(200).json(results.rows);
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const getLiveUsers = async (req, resp) => {
  try {
    const results = await pool.query(queries.getLiveUsers, [
      req.query.projectId,
    ]);

    resp.status(200).json(results.rows);
  } catch (err) {
    console.error("Error ->", err);
    resp.status(500).json({ message: "Internal Server Error" });
  }
};

const setExpandData = async (req, resp) => {
  const { file_tree_id, expand } = req.body;
  if (expand) {
    try {
      await pool.query(queries.insertExpandData, [req.user.id, file_tree_id]);

      resp.status(200).json({ message: "Update expand" });
    } catch (err) {
      console.error("Error ->", err);
      resp.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    try {
      await pool.query(queries.deleteExpandData, [req.user.id, file_tree_id]);

      resp.status(200).json({ message: "DELETED expand" });
    } catch (err) {
      console.error("Error ->", err);
      resp.status(500).json({ message: "Internal Server Error" });
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
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLogs = async (req, res) => {
  const { file_id } = req.query;
  try {
    const result = await pool.query(queries.getLogs, [file_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  const { project_id } = req.query;
  try {
    const result = await pool.query(queries.getMessages, [project_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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
  getLiveUsers,
  setExpandData,
  userSearch,
  getLogs,
  getMessages,
};