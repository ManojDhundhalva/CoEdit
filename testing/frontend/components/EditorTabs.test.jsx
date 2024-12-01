import { fireEvent, render, screen } from '@testing-library/react';
import EditorTabs from '../EditorTabs';
import { vi } from 'vitest';

describe('EditorTabs() EditorTabs method', () => {
  const mockSocket = {
    once: vi.fn(), // Mock the 'once' method
    on: vi.fn(),   // Mock the 'on' method if it's used elsewhere
    emit: vi.fn(), // Mock the 'emit' method if it's used elsewhere
    off: vi.fn()
  };
  const mockHandleTabChange = vi.fn();
  const mockHandleCloseTab = vi.fn();
  const mockSetAllFiles = vi.fn();

  const defaultProps = {
    socket: mockSocket,
    allFiles: [
      {
        file_id: '1',
        file_name: 'File1',
        file_extension: '.txt',
        users: [
          { username: 'user1', is_active_in_tab: true, is_live: true },
          { username: 'user2', is_active_in_tab: false, is_live: true },
        ],
      },
    ],
    selectedTab: 0,
    handleTabChange: mockHandleTabChange,
    handleCloseTab: mockHandleCloseTab,
    selectedFileId: '1',
    setAllFiles: mockSetAllFiles,
    openedTabs: [{ file_id: '1' }],
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('should render the component with tabs and text editor', () => {
      render(<EditorTabs {...defaultProps} />);
      expect(screen.getByText('File1.txt')).toBeInTheDocument();
      //expect(screen.getByText(/TextEditor Component/i)).toBeInTheDocument();
    });

    it('should call handleCloseTab when the close button is clicked', () => {
      render(<EditorTabs {...defaultProps} />);
      const closeButton = screen.getByTestId('CloseIcon');
      fireEvent.click(closeButton);
      expect(mockHandleCloseTab).toHaveBeenCalledWith(0);
    });
  });

  describe('Edge Cases', () => {
    it('should not render a tab if no matching file is found', () => {
      const props = {
        ...defaultProps,
        allFiles: [],
      };
      render(<EditorTabs {...props} />);
      expect(screen.queryByText('File1.txt')).not.toBeInTheDocument();
    });

    it('should handle empty openedTabs gracefully', () => {
      const props = {
        ...defaultProps,
        openedTabs: [],
      };
      render(<EditorTabs {...props} />);
      expect(screen.queryByText('File1.txt')).not.toBeInTheDocument();
      expect(screen.queryByText('TextEditor Component')).not.toBeInTheDocument();
    });

    it('should handle users with no live status', () => {
      const props = {
        ...defaultProps,
        allFiles: [
          {
            file_id: '1',
            file_name: 'File1',
            file_extension: '.txt',
            users: [
              { username: 'user1', is_active_in_tab: true, is_live: false },
            ],
          },
        ],
      };
      render(<EditorTabs {...props} />);
      expect(screen.queryByText('user1')).not.toBeInTheDocument();
    });
  });
});









// it('should call handleTabChange when a tab is clicked', () => {
    //   render(<EditorTabs {...defaultProps} />);
      
    //   // Debugging: Output the rendered content to the console
    //   screen.debug(); 

    //   // Ensure the tab is rendered correctly
    //   const tab = screen.getByText('File1.txt');
    //   if (!tab) {
    //     console.error('Tab not found');
    //     return;
    //   }

    //   // Simulate a click event on the tab
    //   fireEvent.click(tab);

    //   // Check if the mock function was called
    //   expect(mockHandleTabChange).toHaveBeenCalled();
    // });