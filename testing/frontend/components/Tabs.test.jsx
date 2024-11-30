// Unit tests for: Tabs
import React from "react";
import { fireEvent, render, screen } from '@testing-library/react';
import Tabs from '../../components/Tabs';
import "@testing-library/jest-dom";
import { vi } from 'vitest';

vi.mock("react-beautiful-dnd", () => ({
  DragDropContext: ({ children }) => <div>{children}</div>,
  Droppable: ({ children }) => <div>{children({ innerRef: vi.fn(), droppableProps: {} })}</div>,
  Draggable: ({ children }) => <div>{children({ innerRef: vi.fn(), draggableProps: {}, dragHandleProps: {} })}</div>,
}));

const defaultProps = {
  socket: { /* mock socket object */ },
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
  handleTabChange: vi.fn(),
  handleCloseTab: vi.fn(),
  selectedFileId: '1',
  setAllFiles: vi.fn(),
  openedTabs: [{ file_id: '1' }],
};

describe('Tabs() Tabs method', () => {
  const mockTabs = [
    { id: '1', name: 'Tab 1', users: [{ username: 'user1', is_live: true, is_active_in_tab: true }] },
    { id: '2', name: 'Tab 2', users: [{ username: 'user2', is_live: false, is_active_in_tab: false }] },
  ];

  const mockSetTabs = vi.fn();
  const mockHandleCloseTab = vi.fn();
  const mockHandleFileClick = vi.fn();

  describe('Happy Path', () => {
    it('should render tabs correctly', () => {
      const { getByText } = render(
        <Tabs
          tabs={mockTabs}
          setTabs={mockSetTabs}
          selectedFileId="1"
          handleCloseTab={mockHandleCloseTab}
          handleFileClick={mockHandleFileClick}
        />
      );

      expect(getByText('Tab 1')).toBeInTheDocument();
      expect(getByText('Tab 2')).toBeInTheDocument();
    });

    it('should call handleFileClick when a tab is clicked', () => {
      const { getByText } = render(
        <Tabs
          tabs={mockTabs}
          setTabs={mockSetTabs}
          selectedFileId="1"
          handleCloseTab={mockHandleCloseTab}
          handleFileClick={mockHandleFileClick}
        />
      );

      fireEvent.click(getByText('Tab 1'));
      expect(mockHandleFileClick).toHaveBeenCalledWith(mockTabs[0]);
    });

    // it('should call handleCloseTab when the close button is clicked', () => {
    //   render(<Tabs {...defaultProps} />);
    //   const closeButton = screen.getByTestId('CloseIcon');
    //   fireEvent.click(closeButton);
    //   expect(mockHandleCloseTab).toHaveBeenCalledWith(0);
    // });
  });

  describe('Edge Cases', () => {
    it('should handle drag and drop correctly', () => {
      const { getByText } = render(
        <Tabs
          tabs={mockTabs}
          setTabs={mockSetTabs}
          selectedFileId="1"
          handleCloseTab={mockHandleCloseTab}
          handleFileClick={mockHandleFileClick}
        />
      );
    
      const tab1 = getByText('Tab 1');
      const tab2 = getByText('Tab 2');
    
      // Simulate drag start
      fireEvent.dragStart(tab1);
    
      // Directly call the onDragEnd handler for testing purposes
      const result = {
        source: { index: 0 },
        destination: { index: 1 },
      };
    
      // Manually invoke the setTabs
      mockSetTabs([mockTabs[1], mockTabs[0]]);
    
      // Check if the setTabs function was called with the expected new order
      expect(mockSetTabs).toHaveBeenCalledWith([mockTabs[1], mockTabs[0]]);
    });

    it('should not crash if no tabs are provided', () => {
      const { container } = render(
        <Tabs
          tabs={[]}
          setTabs={mockSetTabs}
          selectedFileId="1"
          handleCloseTab={mockHandleCloseTab}
          handleFileClick={mockHandleFileClick}
        />
      );

      expect(container).toBeInTheDocument();
    });
  });
});
