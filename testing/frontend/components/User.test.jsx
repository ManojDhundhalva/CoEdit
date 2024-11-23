// Unit tests for: User (Vitest)

import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import useAPI from '../../hooks/api';
import { isValidFullName } from '../../utils/validation';
import User from '../../components/User';
import '@testing-library/jest-dom'; // Can also use @testing-library/dom if needed
import userEvent from '@testing-library/user-event';
import {toast} from 'react-toastify';

// Mocking necessary modules
vi.mock('../../hooks/api', async () => {
  const actual = await vi.importActual('../../hooks/api');
  return {
    ...actual,
    default: vi.fn().mockReturnValue({ POST: vi.fn() }),  // Make sure POST is mocked
  };
});
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

console.log(toast.success.mock.calls);

vi.mock('../../context/user', async () => {
  const actual = await vi.importActual('../../context/user');
  return {
    ...actual,
    useUser: () => ({
      userInfo: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        userName: 'johndoe',
        profileImage: 0,
        createdAt: '2023-01-01T00:00:00Z',
        updatedOn: '2023-01-02T00:00:00Z',
        image: null,
      },
      getUser: vi.fn(),
    }),
  };
});

vi.mock('../../context/auth', async () => {
  const actual = await vi.importActual('../../context/auth');
  return {
    ...actual,
    useAuth: () => ({
      LogOut: vi.fn(),
    }),
  };
});

vi.mock('../../utils/validation', async () => {
  const actual = await vi.importActual('../../utils/validation');
  return {
    ...actual,
    isValidFullName: vi.fn(),
  };
});

vi.mock('../../utils/formatters', async () => {
  const actual = await vi.importActual('../../utils/formatters');
  return {
    ...actual,
    DateFormatter: vi.fn(),
  };
});


describe('User() User method', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should render user information correctly', () => {
      // Render the User component
      render(<User handleClose={vi.fn()} />);

      // Check if user information is displayed
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Hii, johndoe!')).toBeInTheDocument();
    });

    test('should handle successful profile update', async () => {
      // Mock the API call
      const mockPost = vi.fn().mockResolvedValue({ data: { message: 'Profile updated successfully' } });
      useAPI.mockReturnValue({ POST: mockPost });
    
      render(<User />);
    
      // Simulate user input
      const newName = 'John Doe';
      const input = screen.getByLabelText(/name/i); // Use label text to find the input
      fireEvent.change(input, { target: { value: newName } });
    
      // Simulate the form submission
      fireEvent.click(screen.getByText('Update'));
    
      // Wait for the API call to finish
      await waitFor(() => expect(mockPost).toHaveBeenCalled());
    
      // Verify API response
      expect(mockPost).toHaveBeenCalledWith('/user', {
        name: newName,
      });
    });
  });    

  describe('Edge Cases', () => {
    it('should not update profile with invalid name', () => {
      // Mock validation
      isValidFullName.mockReturnValue(false);

      // Render the User component
      render(<User handleClose={vi.fn()} />);

      // Simulate user input
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Invalid Name!' } });

      // Check if the input is not updated
      expect(screen.getByLabelText('Name').value).toBe('John Doe');
    });

    test('should handle API error gracefully', async () => {
      // Mock API POST call to reject
      const mockPost = vi.fn().mockRejectedValue({
        response: { data: { message: 'Error updating user data' } },
      });
      useAPI.mockReturnValue({ POST: mockPost });
    
      // Mock validation
      isValidFullName.mockReturnValue(true);
    
      // Render the User component
      render(<User handleClose={vi.fn()} />);
    
      // Simulate user input and form submission
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
      fireEvent.click(screen.getByText('Update'));
    
      // **Handle the rejection within the test**
      await expect(mockPost).rejects.toEqual({
        response: { data: { message: 'Error updating user data' } },
      });
    
    });
});
});
// End of unit tests for: User
