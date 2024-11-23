// Unit tests for: addProject

const pool = require("../../db");
const { v4: uuidv4 } = require("uuid");
const { addProject } = require("../project");

jest.mock("../../db");
jest.mock("../../queries/project");
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("addProject() addProject method", () => {
  let req, resp;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      user: { username: "testuser" },
    };
    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    uuidv4.mockReturnValue("mock-uuid");
  });

  describe("Happy Path", () => {
    it("should add a project successfully and return 201 status", async () => {
      // Arrange
      req.body.projectName = "New Project";
      pool.query.mockResolvedValueOnce({ rows: [] }); // Mock addProjects query
      pool.query.mockResolvedValueOnce({ rows: [] }); // Mock addProjectOwners query
      pool.query.mockResolvedValueOnce({ rows: [] }); // Mock addFileTree query
      pool.query.mockResolvedValueOnce({
        rows: [{ project_id: "mock-uuid", project_name: "New Project" }],
      }); // Mock getAllProjects query

      // Act
      await addProject(req, resp);

      // Assert
      expect(pool.query).toHaveBeenCalledTimes(4);
      expect(resp.status).toHaveBeenCalledWith(201);
      expect(resp.json).toHaveBeenCalledWith({
        project_id: "mock-uuid",
        message: "Project added successfully.",
        projects: [{ project_id: "mock-uuid", project_name: "New Project" }],
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return 400 if projectName is not provided", async () => {
      // Arrange
      req.body.projectName = "";

      // Act
      await addProject(req, resp);

      // Assert
      expect(resp.status).toHaveBeenCalledWith(400);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Project name is required.",
      });
    });

    it("should return 500 if there is a database error", async () => {
      // Arrange
      req.body.projectName = "New Project";
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act
      await addProject(req, resp);

      // Assert
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error.",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      // Arrange
      req.user = null;

      // Act
      await addProject(req, resp);

      // Assert
      expect(resp.status).toHaveBeenCalledWith(401);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Unauthorized access",
      });
    });
  });
});

// End of unit tests for: addProject
