const pool = require("../db");
const queries = require("../queries/project");
const { v4: uuidv4 } = require("uuid");

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

module.exports = {
  addProject,
  getAllFiles,
  getAllActiveFiles,
  getFileTree,
  getInitialTabs,
  setExpandData,
};
