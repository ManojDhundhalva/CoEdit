import { render, screen, waitFor } from '@testing-library/react';
import useAPI from "../../hooks/api";
import useTraverseTree from "../../hooks/use-traverse-tree";
import {insertNode} from "../../hooks/use-traverse-tree";
import FileExplorer from '../FileExplorer';
import "@testing-library/jest-dom";

vi.mock("../../hooks/api", () => ({
  __esModule: true,
  default: vi.fn().mockReturnValue({
    GET: vi.fn().mockResolvedValue({ data: [] }),
  }),
}));

vi.mock("../../hooks/use-traverse-tree", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    insertNode: vi.fn(),
    deleteNode: vi.fn(),
  })),
}));

describe('FileExplorer() FileExplorer method', () => {
  let mockSocket;
  let mockSetExplorerData;
  let mockHandleFileClick;
  let mockSetTabs;

  beforeEach(() => {
    mockSocket = {
      emit: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    mockSetExplorerData = vi.fn();
    mockHandleFileClick = vi.fn();
    mockSetTabs = vi.fn();
    
  });

  describe('Socket events handling', () => {
    it('should handle socket insertNode event correctly', () => {
      // Arrange
      const mockInsertNode = vi.fn();
      useTraverseTree.mockImplementation(() => ({
        insertNode: mockInsertNode,
        deleteNode: vi.fn(),
      }));

      render(
        <FileExplorer
          socket={mockSocket}
          projectId="123"
          setExplorerData={mockSetExplorerData}
          handleFileClick={mockHandleFileClick}
          setTabs={mockSetTabs}
          explorerData={{}}
          selectedFileId={null}
          tabs={[]}
        />
      );

      // Simulate socket insert event
      const insertHandler = mockSocket.on.mock.calls[0][1];
      insertHandler({ id: 'newNode' });

      // Assert
      expect(mockInsertNode).toHaveBeenCalledWith({}, { id: 'newNode' });
    });

    it('should handle socket deleteNode event correctly', () => {
      // Arrange
      const mockDeleteNode = vi.fn();
      useTraverseTree.mockImplementation(() => ({
        insertNode: vi.fn(),
        deleteNode: mockDeleteNode,
      }));

      render(
        <FileExplorer
          socket={mockSocket}
          projectId="123"
          setExplorerData={mockSetExplorerData}
          handleFileClick={mockHandleFileClick}
          setTabs={mockSetTabs}
          explorerData={{}}
          selectedFileId={null}
          tabs={[]}
        />
      );

      // Simulate socket delete event
      const deleteHandler = mockSocket.on.mock.calls[1][1];
      deleteHandler({ node_id: 'nodeToDelete' });

      // Assert
      expect(mockDeleteNode).toHaveBeenCalledWith({}, 'nodeToDelete');
    });
  });

  describe('Edge Cases', () => {
    it('should handle API error gracefully', async () => {
      // Arrange
      const mockGET = vi.fn().mockRejectedValue(new Error('API Error'));
      useAPI.mockImplementation(() => ({
        GET: mockGET,
      }));

      // Act
      render(
        <FileExplorer
          socket={mockSocket}
          projectId="123"
          setExplorerData={mockSetExplorerData}
          handleFileClick={mockHandleFileClick}
          setTabs={mockSetTabs}
          explorerData={{}}
          selectedFileId={null}
          tabs={[]}
        />
      );

      await waitFor(() => expect(mockGET).toHaveBeenCalled());

      // Assert
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(mockSetExplorerData).not.toHaveBeenCalled();
    });

    it('should handle socket events for inserting and deleting nodes', () => {
      // Arrange
      const mockInsertNode = vi.fn();
      const mockDeleteNode = vi.fn();
      useTraverseTree.mockImplementation(() => ({
        insertNode: mockInsertNode,
        deleteNode: mockDeleteNode,
      }));

      // Act
      render(
        <FileExplorer
          socket={mockSocket}
          projectId="123"
          setExplorerData={mockSetExplorerData}
          handleFileClick={mockHandleFileClick}
          setTabs={mockSetTabs}
          explorerData={{}}
          selectedFileId={null}
          tabs={[]}
        />
      );

      // Simulate socket events
      const insertHandler = mockSocket.on.mock.calls[0][1];
      const deleteHandler = mockSocket.on.mock.calls[1][1];

      insertHandler({ id: 'newNode' });
      deleteHandler({ node_id: 'nodeToDelete' });

      // Assert
      expect(mockInsertNode).toHaveBeenCalledWith({}, { id: 'newNode' });
      expect(mockDeleteNode).toHaveBeenCalledWith({}, 'nodeToDelete');
    });
  });
});
