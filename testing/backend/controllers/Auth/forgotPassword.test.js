const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../db");
const config = require("../../config");
const queries = require("../../queries/auth/forgotPassword");
const { resetPassword } = require("../../controllers/auth/forgotPassword");

// Mock the database queries and bcrypt/jwt modules
jest.mock("../../db");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Password Reset Controller", () => {

  // Test for resetPassword
  describe("POST /reset-password", () => {

    it("should return 404 if user is not found", async () => {
      // Mocking the behavior of pool.query to simulate no user found
      pool.query.mockResolvedValueOnce({ rowCount: 0 });

      const req = {
        body: {
          username: "nonexistentuser",
          password: "newpassword123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await resetPassword(req, res);

      // Check if the correct status and message are returned
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should reset the password and return 200 if user is found", async () => {
      const mockUser = { id: 1, profile_image: "profile.jpg" };
      // Mocking bcrypt.hash to return the hashed password
      bcrypt.hash.mockResolvedValue("hashedpassword");
      // Mocking the query to return user data
      pool.query.mockResolvedValueOnce({ rowCount: 1 });
      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const req = {
        body: {
          username: "existinguser",
          password: "newpassword123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
      };

      // Mock JWT token generation
      jwt.sign.mockReturnValue("mockToken");

      await resetPassword(req, res);

      // Check if password reset success message and status were returned
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Password reset successfully" });

      // Check that cookies were set
      expect(res.cookie).toHaveBeenCalledWith("authToken", "mockToken", expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith("username", "existinguser", expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith("image", "profile.jpg", expect.any(Object));
    });

    it("should return 500 if there is an internal server error", async () => {
      // Mocking an error during the query execution
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      const req = {
        body: {
          username: "existinguser",
          password: "newpassword123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await resetPassword(req, res);

      // Check if the correct status and error message are returned
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Password not reset" });
    });

  });

});
