import React, { useEffect, useState } from "react";

// Components
import Folder from "./Folder";

// Hooks
import useAPI from "../hooks/api";
import useTraverseTree from "../hooks/use-traverse-tree";

// Material UI Components
import { Box, Skeleton } from "@mui/material";

// Build the tree from flat file structure
const buildFileTree = (fileTreeData, parentId = null) => {
  const items = fileTreeData
    .filter((item) => item.parent_id === parentId)
    .map((item) => ({
      id: item.file_tree_id,
      parentId: item.parent_id,
      name: item.name,
      isFolder: item.is_folder,
      expand: item.expand,
      fileTreeTimestamp: item.file_tree_timestamp,
      items: buildFileTree(fileTreeData, item.file_tree_id), // Recursively build the tree
    }))
    .sort((a, b) => {
      // Sort folders first, then files
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      // If both are the same type (both folders or both files), sort by name
      return a.name.localeCompare(b.name);
    });

  if (parentId === null) {
    return items.length ? items[0] : {};
  }

  return items;
};

function FileExplorer(props) {
  const { GET } = useAPI();
  const [loading, setLoading] = useState(false);

  const {
    handleFileClick,
    selectedFileId,
    socket,
    projectId,
    setTabs,
    tabs,
    explorerData,
    setExplorerData,
  } = props;

  const { insertNode, deleteNode } = useTraverseTree();

  // Emit an event to add a node (file/folder)
  const handleInsertNode = (folderId, name, isFolder) => {
    socket.emit("file-explorer:insert-node", {
      new_node_parent_id: folderId,
      name: name,
      is_folder: isFolder,
    });
  };

  // Emit an event to delete a node
  const handleDeleteNode = (nodeId) => {
    setTabs(tabs.filter((tab) => tab.id !== nodeId));
    socket.emit("file-explorer:delete-node", { node_id: nodeId });
  };

  useEffect(() => {
    if (!socket) return;

    // Handler for inserting a node
    const insertHandler = (new_node) => {
      const finalTree = insertNode(explorerData, new_node);
      setExplorerData({ ...finalTree }); // Ensure immutability to trigger re-render
    };

    // Handler for deleting a node
    const deleteHandler = ({ node_id: nodeId }) => {
      const finalTree = deleteNode(explorerData, nodeId);
      setExplorerData({ ...finalTree }); // Ensure immutability to trigger re-render
    };

    socket.on("file-explorer:insert-node", insertHandler);
    socket.on("file-explorer:delete-node", deleteHandler);

    return () => {
      socket.off("file-explorer:insert-node", insertHandler);
      socket.off("file-explorer:delete-node", deleteHandler);
    };
  }, [socket, explorerData]); // Add explorerData as dependency

  // Fetch file tree from server
  const getFileTree = async () => {
    setLoading(true);
    try {
      const { data } = await GET("/project/get-file-tree", { projectId });
      const tree = buildFileTree(data);
      setExplorerData({ ...tree }); // Ensure new object to trigger re-render
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFileTree();
  }, [projectId]); // Re-fetch when projectId changes

  return (
    <>
      {loading ? (Array.from({ length: 5 }, (_, index) => (
        <Box key={index} sx={{ px: "4px", py: "2px" }}>
          <Skeleton
            key={index}
            animation="wave"
            variant="rounded"
            height={26}
            sx={{ width: "100%", bgcolor: "#A6A6A6" }}
          />
        </Box>
      ))) : (
        <Folder
          explorer={explorerData}
          handleInsertNode={handleInsertNode}
          handleDeleteNode={handleDeleteNode}
          handleFileClick={handleFileClick}
          selectedFileId={selectedFileId}
          makeExpandFolderParent={() => { }}
          paddingLeft={0}
        />
      )}
    </>
  );
}

export default FileExplorer;
