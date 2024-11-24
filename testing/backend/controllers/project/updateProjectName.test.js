// Unit tests for: updateProjectName

const pool = require("../../db");
const queries = require("../../queries/project");
const { v4: uuidv4 } = require("uuid");
const { updateProjectName } = require("../project");

jest.mock("../../db");
jest.mock("../../queries/project");

describe("updateProjectName() updateProjectName method", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        project_id: "test-project-id",
        project_name: "New Project Name",
      },
      user: {
        username: "testuser",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockClear();
  });

  describe("Happy Path", () => {
    it("should update the project name successfully", async () => {
      // Arrange
      pool.query.mockResolvedValueOnce({});

      // Act
      await updateProjectName(req, res);

      // Assert
      expect(pool.query).toHaveBeenCalledWith(queries.updateProjectName, [
        req.user.username,
        req.body.project_id,
        req.body.project_name,
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Updated successfully",
      });
    });
  });

  describe("Edge Cases", () => {
    it("should return 400 if project_id is missing", async () => {
      // Arrange
      req.body.project_id = undefined;

      // Act
      await updateProjectName(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Field are required!" });
    });

    it("should return 400 if project_name is missing", async () => {
      // Arrange
      req.body.project_name = undefined;

      // Act
      await updateProjectName(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Field are required!" });
    });

    it("should return 500 if there is a database error", async () => {
      // Arrange
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act
      await updateProjectName(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});

// End of unit tests for: updateProjectName
