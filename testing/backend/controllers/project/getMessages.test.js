// Unit tests for: getMessages

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { getMessages } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("getMessages() getMessages method", () => {
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
    it("should return messages successfully when project_id is provided", async () => {
      // Arrange
      req.query.project_id = "valid-project-id";
      const mockMessages = [{ id: 1, message: "Test message" }];
      pool.query.mockResolvedValueOnce({ rows: mockMessages });

      // Act
      await getMessages(req, res);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.getMessages, [
        "valid-project-id",
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMessages);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing project_id gracefully", async () => {
      // Arrange
      delete req.query.project_id;

      // Act
      await getMessages(req, res);

      // Assert
      expect(pool.query).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      req.query.project_id = "valid-project-id";
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act
      await getMessages(req, res);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.getMessages, [
        "valid-project-id",
      ]);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});

// End of unit tests for: getMessages
