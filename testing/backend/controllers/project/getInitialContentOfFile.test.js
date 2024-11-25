// Unit tests for: getInitialContentOfFile

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { getInitialContentOfFile } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("getInitialContentOfFile() getInitialContentOfFile method", () => {
  let req, res;

  beforeEach(() => {
    // Set up a mock request and response object
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return the initial content of the file when file_id is provided", async () => {
      // Arrange
      req.query.file_id = "valid-file-id";
      const mockResult = { rows: [{ content: "file content" }] };
      pool.query.mockResolvedValue(mockResult);

      // Act
      await getInitialContentOfFile(req, res);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.getInitialContentOfFile, [
        "valid-file-id",
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult.rows[0]);
    });
  });

  describe("Edge Cases", () => {
    it("should return a 400 error if file_id is not provided", async () => {
      // Arrange
      req.query.file_id = undefined;

      // Act
      await getInitialContentOfFile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Field are required!" });
    });

    it("should return a 500 error if there is a database error", async () => {
      // Arrange
      req.query.file_id = "valid-file-id";
      pool.query.mockRejectedValue(new Error("Database error"));

      // Act
      await getInitialContentOfFile(req, res);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.getInitialContentOfFile, [
        "valid-file-id",
      ]);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});

// End of unit tests for: getInitialContentOfFile
