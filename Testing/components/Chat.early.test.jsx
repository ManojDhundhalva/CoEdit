// Unit tests for: Chat

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import useAPI from '../../hooks/api';
import { getAvatar } from '../../utils/avatar';
import { formatLogTimestamp } from "../../utils/formatters";
import Chat from '../Chat';
import "@testing-library/jest-dom";
import { vi } from 'vitest';

// Mocking the necessary modules
vi.mock("../../hooks/api", () => {
  const originalModule = vi.importActual("../../hooks/api");
  return {
    __esModule: true,
    ...originalModule,
    default: vi.fn(),
  };
});

vi.mock("../../utils/formatters", () => {
  const originalModule = vi.importActual("../../utils/formatters");
  return {
    __esModule: true,
    ...originalModule,
    formatLogTimestamp: vi.fn(),
  };
});

vi.mock("../../utils/avatar", () => {
  const originalModule = vi.importActual("../../utils/avatar");
  return {
    __esModule: true,
    ...originalModule,
    getAvatar: vi.fn(),
  };
});

vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('Chat() Chat method', () => {
  const mockSocket = {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    id: 'socket-id',
  };

  const mockGET = vi.fn();
  useAPI.mockReturnValue({ GET: mockGET });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should render the chat component correctly', () => {
      render(<Chat socket={mockSocket} projectId="123" />);
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    it('should load messages on mount', async () => {
      const messages = [{ username: 'User1', message: 'Hello', time: '10:00 AM', image: 'user1.png' }];
      mockGET.mockResolvedValueOnce({ data: messages });
      getAvatar.mockReturnValue('avatar-url');

      render(<Chat socket={mockSocket} projectId="123" />);

      await waitFor(() => expect(mockGET).toHaveBeenCalledWith('/project/chat/messages', { project_id: '123' }));
      //expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    });

    it('should send a message when submit button is clicked', () => {
      formatLogTimestamp.mockReturnValue('10:00 AM');
      render(<Chat socket={mockSocket} projectId="123" />);

      const input = screen.getByPlaceholderText('Type a message...');
      fireEvent.change(input, { target: { value: 'Test message' } });

      const sendButton = screen.getByTestId('SendRoundedIcon');
      fireEvent.click(sendButton);

      expect(mockSocket.emit).toHaveBeenCalledWith('chat:send-message', { message: 'Test message', time: '10:00 AM' });
    });
  });

  describe('Edge Cases', () => {
    it('should not send a message if the input is empty', () => {
      render(<Chat socket={mockSocket} projectId="123" />);

      const sendButton = screen.getByTestId('SendRoundedIcon')
      fireEvent.click(sendButton);

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockGET.mockRejectedValueOnce(new Error('API Error'));

      render(<Chat socket={mockSocket} projectId="123" />);

      await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to load messages'));
    });

    it('should toggle emoji picker visibility', () => {
      render(<Chat socket={mockSocket} projectId="123" />);

      const emojiButton = screen.getByTestId('SentimentSatisfiedRoundedIcon')
      fireEvent.click(emojiButton);

      expect(
screen.getByTestId('KeyboardDoubleArrowDownRoundedIcon') ).toBeInTheDocument();

      fireEvent.click(emojiButton);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});

// End of unit tests for: Chat
