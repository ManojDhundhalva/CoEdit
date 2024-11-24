// Unit tests for: userSearch

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { userSearch } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("userSearch() userSearch method", () => {
  let req, res;

  beforeEach(() => {
    // Set up a mock request and response object
    jest.clearAllMocks();
    req = {
      query: {
        q: "test",
        projectId: "123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Clear mock calls before each test
    pool.query.mockClear();
  });

  describe("Happy Path", () => {
    it("should return search results when valid query and projectId are provided", async () => {
      // Arrange: Mock the database response
      const mockRows = [{ username: "testUser" }];
      pool.query.mockResolvedValue({ rows: mockRows });

      // Act: Call the userSearch function
      await userSearch(req, res);

      // Assert: Check if the response is as expected
      expect(pool.query).toHaveBeenCalledWith(queries.userSearch, [
        "%test%",
        "123",
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRows);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty search query gracefully", async () => {
      // Arrange: Set an empty search query
      req.query.q = "";

      // Act: Call the userSearch function
      await userSearch(req, res);

      // Assert: Check if the response is as expected
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });

    it("should handle missing projectId gracefully", async () => {
      // Arrange: Remove projectId from the query
      delete req.query.projectId;

      // Act: Call the userSearch function
      await userSearch(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });

    it("should return a 500 error if the database query fails", async () => {
      // Arrange: Mock a database error
      pool.query.mockRejectedValue(new Error("Database error"));

      // Act: Call the userSearch function
      await userSearch(req, res);

      // Assert: Check if the response is as expected
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});

// End of unit tests for: userSearch
