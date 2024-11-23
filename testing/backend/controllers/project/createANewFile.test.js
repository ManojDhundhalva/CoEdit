// Unit tests for: createANewFile

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { createANewFile } = require("../project");

// Import necessary modules and dependencies
// Mock the dependencies
jest.mock("../../db");
jest.mock("../../queries/project");
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("createANewFile() createANewFile method", () => {
  let req, resp;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Set up a mock request and response object
    req = {
      body: {
        newFile: "testFile",
        extension: ".js",
        projectId: "projectId123",
      },
      user: {
        username: "testUser",
      },
    };

    resp = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock UUID generation
    uuidv4.mockReturnValue("unique-id-123");
  });

  describe("Happy Path", () => {
    it("should create a new file successfully", async () => {
      // Mock the database query to resolve successfully
      pool.query.mockResolvedValueOnce({});

      // Call the function
      await createANewFile(req, resp);

      // Assert that the correct query was made
      expect(pool.query).toHaveBeenCalledWith(queries.createANewFile, [
        "unique-id-123",
        "projectId123",
        "testUser",
        "testFile",
        ".js",
      ]);

      // Assert that the response was successful
      expect(resp.status).toHaveBeenCalledWith(200);
      expect(resp.json).toHaveBeenCalledWith({
        message: "File Created Successfully",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return 400 if newFile name is not provided", async () => {
      // Remove newFile from request body
      req.body.newFile = undefined;

      // Call the function
      await createANewFile(req, resp);

      // Assert that the response was a 400 error
      expect(resp.status).toHaveBeenCalledWith(400);
      expect(resp.json).toHaveBeenCalledWith({
        message: "newFile name is required",
      });
    });

    it("should handle database errors gracefully", async () => {
      // Mock the database query to reject with an error
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Call the function
      await createANewFile(req, resp);

      // Assert that the response was a 500 error
      expect(resp.status).toHaveBeenCalledWith(500);
      expect(resp.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});

// End of unit tests for: createANewFile
