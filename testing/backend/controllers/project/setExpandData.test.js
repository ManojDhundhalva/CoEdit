// Unit tests for: setExpandData

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { setExpandData } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("setExpandData() setExpandData method", () => {
  let req, resp;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Set up a mock request and response object
    req = {
      body: { expand: true,
        file_tree_id: "file-tree-id" 
      },
      user: { id: "user-id" },
    };
    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should insert expand data when expand is true", async () => {
      // Arrange
      req.body = { file_tree_id: "file-tree-id", expand: true };
      pool.query.mockResolvedValueOnce({});

      // Act
      await setExpandData(req, resp);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.insertExpandData, [
        "user-id",
        "file-tree-id",
      ]);
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith({ message: "Update expand" });
    });

    it("should delete expand data when expand is false", async () => {
      // Arrange
      req.body = { file_tree_id: "file-tree-id", expand: false };
      pool.query.mockResolvedValueOnce({});

      // Act
      await setExpandData(req, resp);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.deleteExpandData, [
        "user-id",
        "file-tree-id",
      ]);
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith({ message: "DELETED expand" });
    });
  });

  describe("Edge Cases", () => {
    it("should handle database errors when expand is true", async () => {
      // Arrange
      req.body = { file_tree_id: "file-tree-id", expand: true };
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act
      await setExpandData(req, resp);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.insertExpandData, [
        "user-id",
        "file-tree-id",
      ]);
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should handle database errors when expand is false", async () => {
      // Arrange
      req.body = { file_tree_id: "file-tree-id", expand: false };
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act
      await setExpandData(req, resp);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.deleteExpandData, [
        "user-id",
        "file-tree-id",
      ]);
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should handle missing file_tree_id in request body", async () => {
      // Arrange
      delete req.body.file_tree_id;

      // Act
      await setExpandData(req, resp);

      // Assert
      expect(pool.query).not.toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should handle missing expand in request body", async () => {
      // Arrange
      req.body.expand = undefined;

      // Act
      await setExpandData(req, resp);

      // Assert
      expect(pool.query).not.toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});

// End of unit tests for: setExpandData
