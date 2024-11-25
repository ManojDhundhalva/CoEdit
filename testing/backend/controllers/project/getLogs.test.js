// Unit tests for: getLogs

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { getLogs } = require("../project");

// Import necessary modules and functions
// Mock the pool.query method
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("getLogs() getLogs method", () => {
  let req, res;

  beforeEach(() => {
    // Set up a mock request and response object
    jest.clearAllMocks();
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return logs successfully when file_id is provided", async () => {
      // Arrange
      req.query.file_id = "12345";
      const mockLogs = [{ log: "Log entry 1" }, { log: "Log entry 2" }];
      pool.query.mockResolvedValueOnce({ rows: mockLogs });

      // Act
      await getLogs(req, res);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.getLogs, ["12345"]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLogs);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing file_id gracefully", async () => {
      // Arrange
      delete req.query.file_id;

      // Act
      await getLogs(req, res);

      // Assert
      expect(pool.query).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      req.query.file_id = "12345";
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act
      await getLogs(req, res);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.getLogs, ["12345"]);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});

// End of unit tests for: getLogs
