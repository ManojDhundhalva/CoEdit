// Unit tests for: getProjectName

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { getProjectName } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("getProjectName() getProjectName method", () => {
  let req, resp;

  beforeEach(() => {
    // Set up a mock request and response object
    jest.clearAllMocks();
    req = {
      query: { projectId: "test-project-id" },
      user: { username: "test-user" },
    };
    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return the project name when the query is successful", async () => {
      // Arrange: Mock the database response
      const mockProjectName = { name: "Test Project" };
      pool.query.mockResolvedValueOnce({ rows: [mockProjectName] });

      // Act: Call the function
      await getProjectName(req, resp);

      // Assert: Check if the response is as expected
      expect(pool.query).toHaveBeenCalledWith(queries.getProjectName, [
        "test-project-id",
        "test-user",
      ]);
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith(mockProjectName);
    });
  });

  describe("Edge Cases", () => {
    it("should handle database errors gracefully", async () => {
      // Arrange: Mock a database error
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act: Call the function
      await getProjectName(req, resp);

      // Assert: Check if the error is handled correctly
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should handle missing projectId in query", async () => {
      // Arrange: Remove projectId from the request
      delete req.query.projectId;

      // Act: Call the function
      await getProjectName(req, resp);

      // Assert: Check if the response is as expected
      expect(pool.query).not.toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should handle missing user in request", async () => {
      // Arrange: Remove user from the request
      delete req.user;

      // Act: Call the function
      await getProjectName(req, resp);

      // Assert: Check if the response is as expected
      expect(pool.query).not.toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});

// End of unit tests for: getProjectName
