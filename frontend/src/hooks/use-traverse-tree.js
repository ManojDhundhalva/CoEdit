const useTraverseTree = () => {
  // Add a file or folder in the tree
  const insertNode = function (tree, new_node) {
    // If this node is the parent of the new node
    if (tree.id === new_node.parent_id && tree.isFolder) {
      // Ensure tree.items is initialized as an array
      tree.items = tree.items || [];

      // Insert the new node into the items array
      tree.items.push({
        id: new_node.file_tree_id,
        name: new_node.name,
        isFolder: new_node.is_folder,
        fileTreeTimestamp: new_node.file_tree_timestamp,
        parentId: new_node.parent_id,
        items: [], // New node starts with an empty array for its children
      });
      return tree; // Return the updated tree
    }

    // If this node is not the parent, recursively traverse its children
    if (tree.items && tree.items.length > 0) {
      // Recursively try to insert the node in the child items
      const updatedItems = tree.items.map((childNode) =>
        insertNode(childNode, new_node)
      );

      // Return the tree with updated children
      return { ...tree, items: updatedItems };
    }

    // If no child nodes are found or this node is not the parent, return it unchanged
    return tree;
  };

  // Delete a node (file/folder) from the tree
  const deleteNode = function (tree, nodeId) {
    // If the current node's children contain the nodeId, remove it
    tree.items = tree.items.filter((child) => child.id !== nodeId);

    // Recursively delete from children
    if (tree.items && tree.items.length > 0) {
      tree.items = tree.items.map((childNode) => deleteNode(childNode, nodeId));
    }

    return tree;
  };
  // const deleteNode = () => {}; // To be implemented
  const renameNode = () => {}; // To be implemented

  return { insertNode, deleteNode, renameNode };
};

export default useTraverseTree;
