// Unit tests for: getAllActiveFiles

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { getAllActiveFiles } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("getAllActiveFiles() getAllActiveFiles method", () => {
  let req, resp;

  beforeEach(() => {
    // Reset mocks before each test
    pool.query.mockReset();

    // Mock request and response objects
    req = {
      user: {
        username: "testuser",
      },
    };

    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return a list of active files for a valid user", async () => {
      // Arrange: Set up the mock return value for the database query
      const mockFiles = [
        { id: 1, name: "file1" },
        { id: 2, name: "file2" },
      ];
      pool.query.mockResolvedValueOnce({ rows: mockFiles });

      // Act: Call the function
      await getAllActiveFiles(req, resp);

      // Assert: Check that the response is correct
      expect(pool.query).toHaveBeenCalledWith(queries.getAllActiveFiles, [
        "testuser",
      ]);
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith(mockFiles);
    });
  });

  describe("Edge Cases", () => {
    it("should handle database errors gracefully", async () => {
      // Arrange: Set up the mock to throw an error
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act: Call the function
      await getAllActiveFiles(req, resp);

      // Assert: Check that the error is handled
      expect(pool.query).toHaveBeenCalledWith(queries.getAllActiveFiles, [
        "testuser",
      ]);
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should handle missing user in request", async () => {
      // Arrange: Remove user from request
      req.user = null;

      // Act: Call the function
      await getAllActiveFiles(req, resp);

      // Assert: Check that the response is unauthorized
      expect(pool.query).not.toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalledWith(401);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Unauthorized access",
      });
    });
  });
});

// End of unit tests for: getAllActiveFiles
