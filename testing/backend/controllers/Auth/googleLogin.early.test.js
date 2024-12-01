
// Unit tests for: googleLogin




const { googleLogin } = require('../google');
const { oauth2client } = require("../../../config/google");
const pool = require("../../../db");
const queries = require("../../../queries/auth/google");
const config = require("../../../config");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

jest.mock("../../../db");
jest.mock("../../../queries/auth/google");
jest.mock("../../../config");
jest.mock("jsonwebtoken");
jest.mock("uuid");

describe('googleLogin() googleLogin method', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                username: 'testuser',
                emailid: 'testuser@example.com',
                name: 'Test User',
                image: 'http://example.com/image.jpg'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };

        uuidv4.mockReturnValue('unique-id');
        jwt.sign.mockReturnValue('mocked-jwt-token');
    });

    describe('Happy Paths', () => {
        it('should successfully create a new account and return a success message', async () => {
            // Arrange
            pool.query.mockResolvedValueOnce({});

            // Act
            await googleLogin(req, res);

            // Assert
            expect(pool.query).toHaveBeenCalledWith(queries.createAccount, [
                'unique-id',
                'testuser',
                'testuser@example.com',
                'Test User',
                'http://example.com/image.jpg',
                'http://example.com/image.jpg',
                'google'
            ]);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'unique-id', username: 'testuser', image: 'http://example.com/image.jpg' },
                config.JWT_SECRET_KEY,
                { expiresIn: config.JWT_TIMEOUT }
            );
            expect(res.cookie).toHaveBeenCalledWith('authToken', 'mocked-jwt-token', expect.any(Object));
            expect(res.cookie).toHaveBeenCalledWith('username', 'testuser', expect.any(Object));
            expect(res.cookie).toHaveBeenCalledWith('image', 'http://example.com/image.jpg', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Login is successfull' });
        });
    });

    describe('Edge Cases', () => {
    
        it('should handle database query failure gracefully', async () => {
            // Arrange
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            // Act
            await googleLogin(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Google auth Error' });
        });

        it('should handle JWT signing failure gracefully', async () => {
            // Arrange
            pool.query.mockResolvedValueOnce({});
            jwt.sign.mockImplementationOnce(() => { throw new Error('JWT error'); });

            // Act
            
            await googleLogin(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Google auth Error' });
        });

        // it('should handle missing fields in request body', async () => {
        //     // Arrange
        //     req.body = {}; // Empty body

        //     // Act
        //     await googleLogin(req, res);

        //     // Assert
        //     expect(res.status).toHaveBeenCalledWith(500);
        //     expect(res.json).toHaveBeenCalledWith({ message: 'Google auth Error' });
        // });

    });

    describe('Cleanup', () => {
        it('should handle missing fields in request body', async () => {
            // Arrange
            req.body = {}; // Empty body
            console.log(req.body);

            // Act
            await googleLogin(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Google auth Error' });
        });
    });


});



// End of unit tests for: googleLogin
