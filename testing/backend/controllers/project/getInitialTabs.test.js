// Unit tests for: getInitialTabs

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { getInitialTabs } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("getInitialTabs() getInitialTabs method", () => {
  let req, resp;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Set up a mock request and response object
    req = {
      user: { username: "testUser" },
      query: { projectId: "testProjectId" },
    };

    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should return initial tabs successfully", async () => {
      // Arrange: Mock the database responses
      pool.query
        .mockResolvedValueOnce({ rows: [] }) // Mock setAllFilesLive query
        .mockResolvedValueOnce({
          rows: [{ tabId: "tab1" }, { tabId: "tab2" }],
        }); // Mock getInitialTabs query

      // Act: Call the function
      await getInitialTabs(req, resp);

      // Assert: Check if the response is as expected
      expect(pool.query).toHaveBeenCalledWith(queries.setAllFilesLive, [
        "testUser",
        "testProjectId",
      ]);
      expect(pool.query).toHaveBeenCalledWith(queries.getInitialTabs, [
        "testUser",
        "testProjectId",
      ]);
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith([
        { tabId: "tab1" },
        { tabId: "tab2" },
      ]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing user in request", async () => {
      // Arrange: Remove user from request
      delete req.user;

      // Act: Call the function
      await getInitialTabs(req, resp);

      // Assert: Check if the response is unauthorized
      expect(resp.status).toHaveBeenCalledWith(401);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Unauthorized access",
      });
    });

    it("should handle missing projectId in request", async () => {
      // Arrange: Remove projectId from request
      delete req.query.projectId;

      // Act: Call the function
      await getInitialTabs(req, resp);

      // Assert: Check if the response is bad request
      expect(resp.status).toHaveBeenCalledWith(400);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Project ID is required",
      });
    });

    it("should handle database errors gracefully", async () => {
      // Arrange: Mock a database error
      pool.query.mockRejectedValue(new Error("Database error"));

      // Act: Call the function
      await getInitialTabs(req, resp);

      // Assert: Check if the response is internal server error
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});

// End of unit tests for: getInitialTabs
