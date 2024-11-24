// Unit tests for: saveFile

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { saveFile } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("saveFile() saveFile method", () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      body: {
        file_id: "test-file-id",
        content: "test content",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should save the file successfully and return a success message", async () => {
      // Arrange: Mock the database query to resolve successfully
      pool.query.mockResolvedValueOnce();

      // Act: Call the saveFile function
      await saveFile(req, res);

      // Assert: Check if the response is as expected
      expect(pool.query).toHaveBeenCalledWith(queries.saveFile, [
        "test-file-id",
        JSON.stringify({ content: "test content" }),
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "File saved successfully",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle database errors gracefully", async () => {
      // Arrange: Mock the database query to reject with an error
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act: Call the saveFile function
      await saveFile(req, res);

      // Assert: Check if the response is as expected
      expect(pool.query).toHaveBeenCalledWith(queries.saveFile, [
        "test-file-id",
        JSON.stringify({ content: "test content" }),
      ]);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });

    it("should handle missing file_id in request body", async () => {
      // Arrange: Remove file_id from request body
      delete req.body.file_id;

      // Act: Call the saveFile function
      await saveFile(req, res);

      // Assert: Check if the response is as expected
      expect(pool.query).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Field are required!" });
    });

    it("should handle missing content in request body", async () => {
      // Arrange: Remove content from request body
      delete req.body.content;

      // Act: Call the saveFile function
      await saveFile(req, res);

      // Assert: Check if the response is as expected
      expect(pool.query).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Field are required!" });
    });
  });
});

// End of unit tests for: saveFile
