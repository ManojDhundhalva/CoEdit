const pool = require("../../db");
const queries = require("../../queries/auth/verifyCredentials");
const { isValidEmail } = require("../../utils/validation");
const { isEmailExists, isUsernameExists, isGoogleAuthenticated } = require("../../controllers/auth/verifyCredentials");

jest.mock("../../db");
jest.mock("../../utils/validation");

describe("Verify Credentials Controllers", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("isEmailExists", () => {
    test("should return 400 if emailid is not provided", async () => {
      await isEmailExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Email is required" });
    });

    test("should return 400 if emailid is invalid", async () => {
      mockReq.query.emailid = "invalid-email";
      isValidEmail.mockReturnValue(false);

      await isEmailExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "inValid email" });
    });

    test("should return 200 with exists: true if email exists", async () => {
      mockReq.query.emailid = "test@example.com";
      isValidEmail.mockReturnValue(true);
      pool.query.mockResolvedValue({ rows: [{}] });

      await isEmailExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ exists: true });
    });

    test("should return 200 with exists: false if email does not exist", async () => {
      mockReq.query.emailid = "test@example.com";
      isValidEmail.mockReturnValue(true);
      pool.query.mockResolvedValue({ rows: [] });

      await isEmailExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ exists: false });
    });

    test("should return 500 if database query fails", async () => {
      mockReq.query.emailid = "test@example.com";
      isValidEmail.mockReturnValue(true);
      pool.query.mockRejectedValue(new Error("Database error"));

      await isEmailExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("isUsernameExists", () => {
    test("should return 400 if username is not provided", async () => {
      await isUsernameExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Username is required" });
    });

    test("should return 200 with exists: true if username exists", async () => {
      mockReq.query.username = "existinguser";
      pool.query.mockResolvedValue({ rows: [{}] });

      await isUsernameExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ exists: true });
    });

    test("should return 200 with exists: false if username does not exist", async () => {
      mockReq.query.username = "newuser";
      pool.query.mockResolvedValue({ rows: [] });

      await isUsernameExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ exists: false });
    });

    test("should return 500 if database query fails", async () => {
      mockReq.query.username = "testuser";
      pool.query.mockRejectedValue(new Error("Database error"));

      await isUsernameExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("isGoogleAuthenticated", () => {
    test("should return 400 if userNameOrEmail is not provided", async () => {
      await isGoogleAuthenticated(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Filed is required" });
    });

    test("should return 200 with isAccountExists: true if account exists", async () => {
      mockReq.query.userNameOrEmail = "existinguser@example.com";
      pool.query.mockResolvedValue({ rows: [{}] });

      await isGoogleAuthenticated(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ isAccountExists: true });
    });

    test("should return 200 with isAccountExists: false if account does not exist", async () => {
      mockReq.query.userNameOrEmail = "newuser@example.com";
      pool.query.mockResolvedValue({ rows: [] });

      await isGoogleAuthenticated(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ isAccountExists: false });
    });

    test("should return 500 if database query fails", async () => {
      mockReq.query.userNameOrEmail = "testuser";
      pool.query.mockRejectedValue(new Error("Database error"));

      await isGoogleAuthenticated(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });
});
