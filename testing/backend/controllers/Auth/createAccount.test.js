
// Unit tests for: createAccount




const { createAccount } = require('../register');
const pool = require("../../../db");
const queries = require("../../../queries/auth/register");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("../../../config");
const { isValidEmail } = require("../../../utils/validation");


jest.mock("../../../utils/validation", () => {
    const originalModule = jest.requireActual("../../../utils/validation");
    return {
        __esModule: true,
        ...originalModule,
        isValidEmail: jest.fn(),
    };
});

jest.mock("util", () => {
    const originalModule = jest.requireActual("util");
    return {
        __esModule: true,
        ...originalModule,
        promisify: jest.fn().mockImplementation((fn) => fn),
    };
});

jest.mock("bcrypt", () => {
    const originalModule = jest.requireActual("bcrypt");
    return {
        __esModule: true,
        ...originalModule,
        hash: jest.fn(),
    };
});

jest.mock("uuid", () => {
    const originalModule = jest.requireActual("uuid");
    return {
        __esModule: true,
        ...originalModule,
        v4: jest.fn(),
    };
});

jest.mock("../../../db", () => ({
    query: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
}));

describe('createAccount() createAccount method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                username: 'testuser',
                emailid: 'test@example.com',
                password: 'password123',
                profile_image: 'profile.png',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
        };

        isValidEmail.mockReturnValue(true);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        uuidv4.mockReturnValue('unique-user-id');
        jwt.sign.mockReturnValue('jwt-token');
        pool.query.mockResolvedValue({ rows: [] });
    });

    // Happy Path Tests
    it('should create an account successfully when all inputs are valid', async () => {
        await createAccount(req, res);

        expect(pool.query).toHaveBeenCalledWith(queries.getUserName, ['testuser', 'test@example.com']);
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(pool.query).toHaveBeenCalledWith(queries.createAccount, [
            'unique-user-id',
            'testuser',
            'test@example.com',
            'hashedPassword',
            'profile.png',
            'manual',
        ]);
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'unique-user-id', username: 'testuser', image: 'profile.png' },
            config.JWT_SECRET_KEY,
            { expiresIn: config.JWT_TIMEOUT }
        );
        expect(res.cookie).toHaveBeenCalledWith('authToken', 'jwt-token', expect.any(Object));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Account created successfully.' });
    });

    // Edge Case Tests
    it('should return 400 if any required field is missing or invalid', async () => {
        req.body.emailid = ''; // Invalid email

        await createAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
    });

    it('should return 409 if the user already exists', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 'existing-user-id' }] });

        await createAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: 'User already exists.' });
    });

    it('should return 500 if there is an internal server error', async () => {
        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await createAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error.' });
    });
});

// End of unit tests for: createAccount
