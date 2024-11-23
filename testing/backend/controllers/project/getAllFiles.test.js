// Unit tests for: getAllFiles

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { getAllFiles } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("getAllFiles() getAllFiles method", () => {
  let req, resp;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Set up a mock request and response
    req = {
      query: { projectId: "testId"},
      user: { username: "testUser" },
    };
    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return a list of files when projectId is provided", async () => {
      // Arrange
      const mockFiles = [
        { id: 1, name: "file1" },
        { id: 2, name: "file2" },
      ];
      pool.query.mockResolvedValueOnce({ rows: mockFiles });

      // Act
      await getAllFiles(req, resp);

      // Assert
      // expect(pool.query).toHaveBeenCalledWith(
      //   queries.makeAllActiveFilesToLive,
      //   ["testUser"],
      // );
      // expect(pool.query).toHaveBeenCalledWith(queries.getAllFiles, [
      //   "validProjectId",
      // ]);
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith(mockFiles);
    });
  });

  describe("Edge Cases", () => {
    it("should return 400 if projectId is not provided", async () => {

      delete req.query.projectId;
      // Act
      await getAllFiles(req, resp);

      // Assert
      expect(resp.status).toHaveBeenCalledWith(400);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Project ID is required",
      });
    });

    it("should return 500 if there is a database error", async () => {
      // Arrange
      req.query.projectId = "validProjectId";
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act
      await getAllFiles(req, resp);

      // Assert
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});

// End of unit tests for: getAllFiles
