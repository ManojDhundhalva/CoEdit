const { getAccount } = require("./login");
const pool = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../../config/");

// Mock dependencies
jest.mock("../../db");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");
jest.mock("../../config/", () => ({
  JWT_SECRET: "test-secret"
}));

describe("Login Controller - getAccount", () => {
  let mockReq;
  let mockRes;
  const mockUser = {
    id: 1,
    username: "testuser",
    password: "hashedPassword123",
    profile_image: "profile.jpg"
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock request object
    mockReq = {
      body: {}
    };

    // Mock response object with Jest mock functions
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };

    // Default successful mock implementations
    pool.query.mockResolvedValue({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mock-jwt-token");
  });

  describe("Input Validation", () => {
    test("should return 400 when username is empty", async () => {
      mockReq.body = { username: "", password: "validPassword" };

      await getAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "REQUEST - Fields are Empty!"
      });
    });

    test("should return 400 when password is empty", async () => {
      mockReq.body = { username: "validUser", password: "" };

      await getAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "REQUEST - Fields are Empty!"
      });
    });

    test("should return 400 when both fields are empty", async () => {
      mockReq.body = { username: "", password: "" };

      await getAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "REQUEST - Fields are Empty!"
      });
    });

    test("should return 400 when fields contain only whitespace", async () => {
      mockReq.body = { username: "   ", password: "   " };

      await getAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "REQUEST - Fields are Empty!"
      });
    });
  });

  describe("User Lookup", () => {
    test("should return 404 when user doesn't exist", async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      mockReq.body = { username: "nonexistent", password: "password123" };

      await getAccount(mockReq, mockRes);

      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        [mockReq.body.username]
      );
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Username or Email ID doesn't exist."
      });
    });

    test("should handle database errors properly", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database connection failed"));
      mockReq.body = { username: "testuser", password: "password123" };

      await getAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "DATABASE - Internal Server Error"
      });
    });
  });
    
    describe("Password Verification", () => {
  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };

    // Mock user data
    const mockUser = {
      id: 1,
      username: "testuser",
      password: "hashedPassword123",
      profile_image: "profile.jpg"
    };

    // Setup default successful mocks
    pool.query.mockResolvedValue({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mock-jwt-token");
  });

  test("should return 401 when password is incorrect", async () => {
    // Setup
    mockReq.body = {
      username: "testuser",
      password: "wrongpassword"
    };

    // Mock database response for existing user
    pool.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        password: "hashedCorrectPassword",
        profile_image: "profile.jpg"
      }]
    });

    // Mock bcrypt comparison to return false for wrong password
    bcrypt.compare.mockResolvedValueOnce(false);

    // Execute
    await getAccount(mockReq, mockRes);

    // Assert
    // Verify that bcrypt.compare was called with correct arguments
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrongpassword",
      "hashedCorrectPassword"
    );

    // Verify database query was called with username
    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      ["testuser"]
    );

    // Verify response status and message
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Incorrect Password"
    });

    // Verify JWT was not generated
    expect(jwt.sign).not.toHaveBeenCalled();

    // Verify no cookies were set
    expect(mockRes.cookie).not.toHaveBeenCalled();
  });

  test("should return 200 when password is correct", async () => {
    // Setup
    mockReq.body = {
      username: "testuser",
      password: "correctpassword"
    };

    // Mock database response for existing user
    pool.query.mockResolvedValueOnce({
      rows: [{
        id: 1,
        password: "hashedCorrectPassword",
        profile_image: "profile.jpg"
      }]
    });

    // Mock bcrypt comparison to return true for correct password
    bcrypt.compare.mockResolvedValueOnce(true);

    // Mock JWT token generation
    jwt.sign.mockReturnValue("valid-jwt-token");

    // Execute
    await getAccount(mockReq, mockRes);

    // Assert
    // Verify that bcrypt.compare was called with correct arguments
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "correctpassword",
      "hashedCorrectPassword"
    );

    // Verify database query was called
    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      ["testuser"]
    );

    // Verify successful response
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Login is successfull"
    });

    // Verify JWT token was generated
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, username: "testuser" },
      expect.any(String),
      { expiresIn: "24h" }
    );

    // Verify cookies were set
    expect(mockRes.cookie).toHaveBeenCalledWith(
      "authToken",
      "valid-jwt-token",
      expect.any(Object)
    );
    expect(mockRes.cookie).toHaveBeenCalledWith(
      "username",
      "testuser",
      expect.any(Object)
    );
    expect(mockRes.cookie).toHaveBeenCalledWith(
      "image",
      "profile.jpg",
      expect.any(Object)
    );
  });
});

  
  
});