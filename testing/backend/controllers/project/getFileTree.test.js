// Unit tests for: getFileTree

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { getFileTree } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("getFileTree() getFileTree method", () => {
  let req, resp;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Set up a mock request and response object
    req = {
      query: { projectId: "test-project-id" },
      user: { id: "test-user-id" },
    };

    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return the file tree for a valid project ID and user ID", async () => {
      // Arrange: Mock the database response
      const mockFileTree = [{ id: "file1", name: "File 1" }];
      pool.query.mockResolvedValueOnce({ rows: mockFileTree });

      // Act: Call the getFileTree function
      await getFileTree(req, resp);

      // Assert: Check that the response is correct
      expect(pool.query).toHaveBeenCalledWith(queries.getFileTree, [
        "test-project-id",
        "test-user-id",
      ]);
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith(mockFileTree);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing projectId in the request query", async () => {
      // Arrange: Remove projectId from the request
      delete req.query.projectId;

      // Act: Call the getFileTree function
      await getFileTree(req, resp);

      // Assert: Check that the response is a 400 error
      expect(resp.status).toHaveBeenCalledWith(400);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Project ID is required",
      });
    });

    it("should handle missing user ID in the request", async () => {
      // Arrange: Remove user ID from the request
      delete req.user.id;

      // Act: Call the getFileTree function
      await getFileTree(req, resp);

      // Assert: Check that the response is a 401 error
      expect(resp.status).toHaveBeenCalledWith(401);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Unauthorized access",
      });
    });

    it("should handle database errors gracefully", async () => {
      // Arrange: Mock a database error
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act: Call the getFileTree function
      await getFileTree(req, resp);

      // Assert: Check that the response is a 500 error
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});

// End of unit tests for: getFileTree
