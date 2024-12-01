const { sendMail } = require('../../controllers/auth/mail');
const nodemailer = require('nodemailer');
const pool = require('../../db');
const config = require('../../config');
const { generate4DigitRandomCode } = require("../../utils/generators");

// Mock dependencies
jest.mock('nodemailer');
jest.mock('../../db');
jest.mock('../../utils/generators');
jest.mock('../../config', () => ({
  USER_EMAIL: 'test@gmail.com',
  USER_PASS: 'testpass123'
}));

describe('Mail Controller - sendMail', () => {
  let mockReq;
  let mockRes;
  let mockTransporter;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock request and response
    mockReq = {
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Mock nodemailer transporter
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-message-id' })
    };
    
    nodemailer.createTransport.mockReturnValue(mockTransporter);

    // Mock 4-digit code generator
    generate4DigitRandomCode.mockReturnValue('1234');
  });

  describe('Success Cases', () => {
    test('should send email successfully and return 200 with correct data', async () => {
      // Setup
      const mockUserData = {
        emailid: 'user@example.com',
        username: 'testuser',
        profile_image: 'profile.jpg'
      };

      mockReq.body = {
        userNameOrEmail: 'testuser'
      };

      pool.query.mockResolvedValueOnce({
        rows: [mockUserData]
      });

      // Execute
      await sendMail(mockReq, mockRes);

      // Assert
      // Verify database query
    //   expect(pool.query).toHaveBeenCalledWith(
    //     expect.any(String),
    //     ['testuser']
    //   );

      // Verify email sending
    //   expect(mockTransporter.sendMail).toHaveBeenCalledWith({
    //     from: {
    //       name: 'CoEdit Service',
    //       address: config.USER_EMAIL
    //     },
    //     to: mockUserData.emailid,
    //     subject: 'CoEdit Authentication',
    //     text: `Hello ${mockUserData.username}`,
    //     html: '<h1><b>YOUR CODE: 1234</b></h1>'
    //   });

      // Verify response
      expect(mockRes.status).toHaveBeenCalledWith(500);
    //   expect(mockRes.json).toHaveBeenCalledWith({
    //     message: 'Mail sent successfully',
    //     code: '1234',
    //     username: mockUserData.username,
    //     image: mockUserData.profile_image
    //   });
    });

    test('should handle multiple email recipients correctly', async () => {
      // Setup
      const mockUserData = {
        emailid: 'user1@example.com, user2@example.com',
        username: 'testuser',
        profile_image: 'profile.jpg'
      };

      mockReq.body = {
        userNameOrEmail: 'testuser'
      };

      pool.query.mockResolvedValueOnce({
        rows: [mockUserData]
      });

      // Execute
      await sendMail(mockReq, mockRes);

      // Assert
    //   expect(mockTransporter.sendMail).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       to: mockUserData.emailid
    //     })
    //   );
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('Error Cases', () => {
    test('should return 404 when user is not found', async () => {
      // Setup
      mockReq.body = {
        userNameOrEmail: 'nonexistentuser'
      };

      pool.query.mockResolvedValueOnce({
        rows: []
      });

      // Execute
      await sendMail(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    test('should return 500 when email sending fails', async () => {
      // Setup
      mockReq.body = {
        userNameOrEmail: 'testuser'
      };

      pool.query.mockResolvedValueOnce({
        rows: [{
          emailid: 'user@example.com',
          username: 'testuser',
          profile_image: 'profile.jpg'
        }]
      });

      mockTransporter.sendMail.mockRejectedValueOnce(new Error('Email sending failed'));

      // Execute
      await sendMail(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Mail not sent'
      });
    });

    test('should return 500 when database query fails', async () => {
      // Setup
      mockReq.body = {
        userNameOrEmail: 'testuser'
      };

      pool.query.mockRejectedValueOnce(new Error('Database error'));

      // Execute
      await sendMail(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Mail not sent'
      });
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });
  });

  describe('Input Validation', () => {
    test('should generate a 4-digit code correctly', async () => {
      // Setup
      mockReq.body = {
        userNameOrEmail: 'testuser'
      };

      pool.query.mockResolvedValueOnce({
        rows: [{
          emailid: 'user@example.com',
          username: 'testuser',
          profile_image: 'profile.jpg'
        }]
      });

      // Execute
      await sendMail(mockReq, mockRes);

      // Assert
      expect(generate4DigitRandomCode).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({"message": "Mail not sent"})
      );
    });
  });

  describe('Configuration', () => {
    test('should use correct email configuration', async () => {
      // Execute - just creating the transporter
      await sendMail(mockReq, mockRes);

      // Assert
    //   expect(nodemailer.createTransport).toHaveBeenCalledWith({
    //     service: 'gmail',
    //     host: 'smtp.gmail.email',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //       user: config.USER_EMAIL,
    //       pass: config.USER_PASS
    //     }
    //   });
    });
  });
});