// Unit tests for: getLiveUsers

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { getLiveUsers } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("getLiveUsers() getLiveUsers method", () => {
  let req, resp;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Set up a mock request and response object
    req = {
      query: {
        projectId: "test-project-id",
      },
    };

    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return live users for a valid project ID", async () => {
      // Arrange: Mock the database response
      const mockRows = [{ userId: "user1" }, { userId: "user2" }];
      pool.query.mockResolvedValueOnce({ rows: mockRows });

      // Act: Call the function
      await getLiveUsers(req, resp);

      // Assert: Check if the response is correct
      expect(pool.query).toHaveBeenCalledWith(queries.getLiveUsers, [
        "test-project-id",
      ]);
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith(mockRows);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing projectId in request query", async () => {
      // Arrange: Remove projectId from request query
      req.query.projectId = undefined;

      // Act: Call the function
      await getLiveUsers(req, resp);

      // Assert: Check if the response is a 500 error
      expect(pool.query).not.toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should handle database query errors gracefully", async () => {
      // Arrange: Mock a database error
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act: Call the function
      await getLiveUsers(req, resp);

      // Assert: Check if the response is a 500 error
      expect(pool.query).toHaveBeenCalledWith(queries.getLiveUsers, [
        "test-project-id",
      ]);
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});

// End of unit tests for: getLiveUsers
