
// Unit tests for: googleCredentials




const { oauth2client } = require("../../../config/google");
const pool = require("../../../db");
const queries = require("../../../queries/auth/google");
const config = require("../../../config");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const fetch = require('node-fetch');
const { googleCredentials } = require('../google');

jest.mock("../../../config/google", () => ({
  oauth2client: {
    getToken: jest.fn(),
    setCredentials: jest.fn(),
  },
}));

jest.mock("../../../db", () => ({
  query: jest.fn(),
}));

jest.mock("node-fetch", () => jest.fn());

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe('googleCredentials() googleCredentials method', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {
        code: 'test-code',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('Happy Paths', () => {
    it('should successfully authenticate and return user info when account exists', async () => {
      // Mock `oauth2client.getToken`
      oauth2client.getToken.mockResolvedValue({
        tokens: { access_token: 'test-access-token' },
      });

      // Mock `fetch` call
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          email: 'test@example.com',
          name: 'Test User',
          picture: 'test-picture-url',
        }),
      });

      // Mock `queries` and `pool.query`
      jest.mock('../../../queries/auth/google', () => ({
        getAccountByEmail: 'SELECT id, username, profile_image FROM users WHERE emailid = $1;',
      }));

      pool.query.mockResolvedValue({
        rows: [{ id: '1', username: 'Test User', profile_image: 'test-picture-url' }],
      });

      // Mock `jwt.sign`
      jwt.sign.mockReturnValue('test-jwt-token');

      await googleCredentials(req, res);

      expect(oauth2client.getToken).toHaveBeenCalledWith('test-code');
      // expect(pool.query).toHaveBeenCalledWith(
      //   'SELECT id, username, profile_image FROM users WHERE emailid = $1;',
      //   ['test@example.com']
      // );
      // expect(jwt.sign).toHaveBeenCalledWith(
      //   { id: '1', username: 'Test User', image: 'test-picture-url' },
      //   config.JWT_SECRET_KEY,
      //   { expiresIn: config.JWT_TIMEOUT }
      // );
      expect(res.cookie).toHaveBeenCalledTimes(3);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accountExists: true, message: 'Login is successfull' });
    });
  });


  describe('Edge Cases', () => {
    it('should handle fetch user info failure', async () => {
      // Mocking successful token retrieval
      oauth2client.getToken.mockResolvedValue({
        tokens: { access_token: 'test-access-token' },
      });

      // Mocking failed user info fetch
      fetch.mockResolvedValue({
        ok: false,
      });

      await googleCredentials(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch user info' });
    });

    it('should handle errors and return 500 status', async () => {
      // Mocking an error during token retrieval
      oauth2client.getToken.mockRejectedValue(new Error('Token error'));

      await googleCredentials(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Google auth Error' });
    });
  });
});

// End of unit tests for: googleCredentials
