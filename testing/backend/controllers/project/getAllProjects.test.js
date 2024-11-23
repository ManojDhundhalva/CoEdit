// Unit tests for: getAllProjects

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { getAllProjects } = require("../project");

jest.mock("../../db");
jest.mock("../../queries/project");

describe("getAllProjects() getAllProjects method", () => {
  let req, resp;

  beforeEach(() => {
    req = {
      user: {
        id: "user-id",
        username: "testuser",
      },
    };
    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return a list of projects for an authenticated user", async () => {
      // Arrange
      const mockProjects = [
        { id: "1", name: "Project 1" },
        { id: "2", name: "Project 2" },
      ];
      pool.query.mockResolvedValue({ rows: mockProjects });

      // Act
      await getAllProjects(req, resp);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.getAllProjects, [
        req.user.username,
      ]);
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith(mockProjects);
    });
  });

  describe("Edge Cases", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Arrange
      req.user = null;

      // Act
      await getAllProjects(req, resp);

      // Assert
      expect(resp.status).toHaveBeenCalledWith(401);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Unauthorized access",
      });
    });

    it("should return 500 if there is a database error", async () => {
      // Arrange
      pool.query.mockRejectedValue(new Error("Database error"));

      // Act
      await getAllProjects(req, resp);

      // Assert
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should return 401 if user id is missing", async () => {
      // Arrange
      req.user.id = null;

      // Act
      await getAllProjects(req, resp);

      // Assert
      expect(resp.status).toHaveBeenCalledWith(401);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Unauthorized access",
      });
    });
  });
});

// End of unit tests for: getAllProjects
