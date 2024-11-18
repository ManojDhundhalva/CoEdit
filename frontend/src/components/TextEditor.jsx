import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../CSS/TextEditor.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

function TextEditor({ socket, file_id, selectedFileId, setAllFiles }) {
  const [quill, setQuill] = useState(null);

  useEffect(() => {
    if (!quill || !socket) return;

    // Handle document loading
    socket.once("load-document", ({ document }) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", { file_id });

    return () => {
      socket.emit("leaveFile", { file_id });
    };
  }, [quill, socket, file_id]);

  // Emit changes only for user actions
  useEffect(() => {
    if (!quill || !socket) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", { delta, file_id });
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, socket, file_id]);

  // Receive changes and apply them without emitting them
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = ({ delta, file_id: fileID }) => {
      if (fileID === file_id) {
        quill.updateContents(delta, "api");
      }
    };

    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [quill, socket, file_id]);

  // Handle the Quill editor initialization/reset when switching tabs
  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = ""; // Clear out any existing content in the wrapper

    // Create a fresh Quill instance
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    q.disable(); // Disable until the document is loaded
    q.setText("Loading..."); // Set the initial text to indicate loading

    setQuill(q); // Save the new Quill instance
  }, []);

  return (
    <div className="main">
      <div className="container" ref={wrapperRef}></div>
    </div>
  );
}

export default TextEditor;
