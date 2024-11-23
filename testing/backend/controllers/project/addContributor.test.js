// Unit tests for: addContributor

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { addContributor } = require("../project");

// Import necessary modules and functions
// Mock the pool.query function
jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("addContributor() addContributor method", () => {
  let req, resp;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      body: {
        projectId: "test-project-id",
        contributors: [{ username: "user1" }, { username: "user2" }],
      },
    };

    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("Happy Path", () => {
    it("should add contributors successfully", async () => {
      // Arrange: Set up the mock to resolve successfully
      pool.query.mockResolvedValue({});

      // Act: Call the addContributor function
      await addContributor(req, resp);

      // Assert: Check if the response is as expected
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenCalledWith(queries.addContributor, [
        "test-project-id",
        "user1",
      ]);
      expect(pool.query).toHaveBeenCalledWith(queries.addContributor, [
        "test-project-id",
        "user2",
      ]);
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith({ message: "Added contributors" });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty contributors list", async () => {
      // Arrange: Set up an empty contributors list
      req.body.contributors = [];

      // Act: Call the addContributor function
      await addContributor(req, resp);

      // Assert: Check if the response is as expected
      expect(pool.query).not.toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith({ message: "Added contributors" });
    });

    it("should handle database errors gracefully", async () => {
      // Arrange: Set up the mock to reject with an error
      pool.query.mockRejectedValue(new Error("Database error"));

      // Act: Call the addContributor function
      await addContributor(req, resp);

      // Assert: Check if the response is as expected
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should handle missing projectId in request body", async () => {
      // Arrange: Remove projectId from request body
      delete req.body.projectId;

      // Act: Call the addContributor function
      await addContributor(req, resp);

      // Assert: Check if the response is as expected
      expect(pool.query).not.toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    it("should handle missing contributors in request body", async () => {
      // Arrange: Remove contributors from request body
      delete req.body.contributors;

      // Act: Call the addContributor function
      await addContributor(req, resp);

      // Assert: Check if the response is as expected
      expect(pool.query).not.toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});

// End of unit tests for: addContributor
