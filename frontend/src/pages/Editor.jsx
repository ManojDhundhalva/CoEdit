// Editor.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";
import FileExplorer from "../components/FileExplorer";
import Tabs from "../components/Tabs";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import Tools from "../components/Tools";
import { useSocket } from "../context/socket";
import useAPI from "../hooks/api";
import Cookies from "js-cookie";
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import DataArrayRoundedIcon from '@mui/icons-material/DataArrayRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import TextsmsRoundedIcon from '@mui/icons-material/TextsmsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Chat from "../components/Chat";
import { io } from "socket.io-client";
import config from "../config";

const styles = {
  container: {
    display: "flex",
    height: "100vh", // Ensure the container takes full viewport height
  },
  sidebar: {
    minWidth: "200px",
    backgroundColor: "#f0f0f0",
    color: "white",
    overflowY: "auto",
    transition: "width 0.2s ease",
    height: "100%", // Ensure the sidebar takes full height of the container
  },
  dragHandle: {
    width: "5px",
    cursor: "ew-resize",
    backgroundColor: "#666",
    zIndex: 10,
  },
  mainContent: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    width: "100%",
    height: "100%",
  },
};


function Editor() {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [explorerData, setExplorerData] = useState({});
  const [initialTabs, setInitialTabs] = useState([]);
  const [liveUsers, setLiveUsers] = useState([]);

  const { GET } = useAPI();
  const params = useParams();
  const projectId = params?.projectId || null;

  const { socket, setSocket } = useSocket();

  useEffect(() => {
    const s = io(config.BACKEND_API, {
      withCredentials: true,
      transports: ['websocket', 'polling'], // Use WebSocket first, then fallback to polling
      upgrade: false // Sometimes, disabling the HTTP long-polling upgrade helps
    });

    s.on("connect_error", (err) => console.log(err));
    s.on("connect_failed", (err) => console.log(err));

    setSocket((prev) => s);

    return () => {
      s.disconnect();
    };
  }, []);

  const getLiveUsers = async () => {
    try {
      const results = await GET("/project/get-live-users", { projectId });
      setLiveUsers((prev) => results.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    getLiveUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const liveUserJoined = ({ username, image }) => {
      setLiveUsers((prev) => {
        // Check if the username already exists
        const usernameExists = prev.some((user) => user.username === username);

        // If username already exists, return the previous state
        if (usernameExists) return prev;

        // Return a new array with the new user added
        return [...prev, { username, image }];
      });
    };

    const liveUserLeft = ({ username }) => {
      setLiveUsers((prev) => {
        // Return a new array with the specified username removed
        return prev.filter((user) => user.username !== username);
      });
    };

    socket.on("editor:live-user-joined", liveUserJoined);
    socket.on("editor:live-user-left", liveUserLeft);

    return () => {
      socket.off("editor:live-user-joined", liveUserJoined);
      socket.off("editor:live-user-left", liveUserLeft);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("editor:join-project", {
      project_id: projectId,
      username: Cookies.get("username"),
      image: Cookies.get("image"),
    });
  }, [socket]);

  const handleFileClick = (file) => {
    setTabs((prevTabs) => {
      const selectedIndex = prevTabs.findIndex(
        (tab) => tab.id === selectedFileId
      );
      const fileIndex = prevTabs.findIndex((tab) => tab.id === file.id);

      if (fileIndex === -1) {
        const newTabs = [...prevTabs];
        if (selectedIndex === -1) {
          newTabs.push(file);
        } else {
          newTabs.splice(selectedIndex + 1, 0, file);
        }
        return newTabs;
      }
      return prevTabs;
    });
    setSelectedFileId(file.id);
  };

  const handleCloseTab = (fileId) => {
    // socket.emit("code-editor:user-left", {
    //   file_id: fileId,
    //   username: window.localStorage.getItem("username"),
    // });
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.filter((tab) => tab.id !== fileId);
      if (selectedFileId === fileId) {
        const newSelectedFileId =
          updatedTabs.length > 0
            ? updatedTabs[updatedTabs.length - 1].id
            : null;
        setSelectedFileId(newSelectedFileId);
      }
      return updatedTabs;
    });
  };

  const getInitialTabs = async () => {
    try {
      const results = await GET("/project/get-initial-tabs", { projectId });

      const data = results.data.map((file) => ({
        id: file.file_id,
        name: file.file_name,
        users: [
          {
            is_active_in_tab: file.is_active_in_tab,
            is_live: file.is_live,
            live_users_timestamp: file.live_users_timestamp,
            project_id: file.project_id,
            username: file.username,
            image: file.image,
          },
        ],
      }));

      setTabs((prev) => data);
      setInitialTabs((prev) => results.data);

      setSelectedFileId((prev) => {
        const activeFile = results.data.find((file) => file.is_active_in_tab);
        return activeFile ? activeFile.file_id : null; // Return the file_id or null if not found
      });
    } catch (err) {
    }
  };

  useEffect(() => {
    getInitialTabs();
  }, []);


  useEffect(() => {
    if (!socket) return;
    initialTabs.forEach((file) => {
      socket.emit("code-editor:join-file", { file_id: file.file_id });
    });
  }, [initialTabs]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("code-editor:join-file", { file_id: selectedFileId });
  }, [selectedFileId]);

  const sidebarRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false); // We use refs instead of state to avoid re-renders

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = "ew-resize";
    document.getElementById("dragHandle").style.backgroundColor = "black";
    document.getElementById("dragHandle").style.border = "2px solid white";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !sidebarRef.current || !containerRef.current) return;

    const newWidth = e.clientX;
    if (newWidth > 100 && newWidth < 600) { // Set min and max width for sidebar
      sidebarRef.current.style.width = `${newWidth}px`;
    }
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      document.body.style.cursor = "default";
      document.getElementById("dragHandle").style.backgroundColor = "#666";
      document.getElementById("dragHandle").style.border = "none";
    }
  };

  // Adding event listeners when the component mounts
  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Cleanup the event listeners when the component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prevIndex) => (prevIndex + 1) % 4); // Cycle through 0, 1, 2
    }, 1000); // Switch every 1 second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const renderIcon = () => {
    switch (iconIndex) {
      case 0:
        return <DataObjectRoundedIcon sx={{ fontSize: "2em" }} />;
      case 1:
        return <i className="fa-solid fa-code" style={{ fontSize: "1.5em" }}></i>;
      case 2:
        return <DataArrayRoundedIcon sx={{ fontSize: "2em" }} />;
      case 3:
        return <FormatQuoteRoundedIcon sx={{ fontSize: "2em" }} />
      default:
        return null;
    }
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef(null);

  const handleCloseChat = () => setIsChatOpen((prev) => false);

  useEffect(() => {
    // Function to handle keydown event
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseChat(); // Call the function on pressing Escape
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleEsc);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleCloseChat]);

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column", width: "100%" }}>
      {isChatOpen ? (
        <Box sx={{ position: 'fixed', left: 6, bottom: 6, zIndex: 9999 }}>
          {/* Outer Box Container */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '100%',
              maxHeight: 'calc(100vh - 12px)',
              minWidth: '400px',
              bgcolor: '#F2F2F2',
              borderRadius: '10px',
              border: '1px solid black',
              overflow: 'hidden',
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                borderBottom: '2px solid #E6E6E6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 0,
                px: "10px",
              }}
            >
              <Typography variant="h6">Chat</Typography>
              <CloseRoundedIcon
                onClick={() => setIsChatOpen(false)}
                sx={{
                  p: '4px',
                  cursor: 'pointer',
                  fontWeight: "bold",
                  color: 'black',
                  borderRadius: '4px',
                  '&:hover': { bgcolor: '#CCCCCC' },
                }}
              />
            </Box>

            {/* Chat Content Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                flexGrow: 1,
                height: '100%', // Ensures the chat area uses all remaining space
                overflowY: 'auto',
              }}
            >
              <Chat socket={socket} projectId={projectId} />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box onClick={() => setIsChatOpen(true)} sx={{ "&:hover": { bgcolor: "#595959", color: "black" }, backgroundColor: "#404040", position: "fixed", left: 20, bottom: 20, p: "8px", borderRadius: 9, cursor: "pointer" }}>
          <TextsmsRoundedIcon sx={{ color: "white" }} />
        </Box>
      )}
      <Tools liveUsers={liveUsers} />
      <div ref={containerRef} style={styles.container}>
        <div ref={sidebarRef} style={styles.sidebar}>
          <FileExplorer
            tabs={tabs}
            setTabs={setTabs}
            socket={socket}
            projectId={projectId}
            handleFileClick={handleFileClick}
            selectedFileId={selectedFileId}
            explorerData={explorerData}
            setExplorerData={setExplorerData}
          />
        </div>
        <div id="dragHandle" style={styles.dragHandle} onMouseDown={handleMouseDown} />
        <div style={styles.mainContent}>
          {tabs.length === 0 ? (
            <Box sx={{ height: "100%", display: "grid", placeItems: "center" }}>
              <Typography variant="h2" sx={{ display: "flex", alignItems: "center" }}>
                {renderIcon()}
                <span style={{ marginLeft: "0.5em" }}>Workspace</span>
              </Typography>
            </Box>
          ) : (
            <>
              <Box>
                <Tabs
                  tabs={tabs}
                  setTabs={setTabs}
                  selectedFileId={selectedFileId}
                  handleFileClick={handleFileClick}
                  handleCloseTab={handleCloseTab}
                />
              </Box>
              <Box sx={{ position: "relative", width: "100%", height: "calc(100vh - 94px)", overflow: "hidden" }}>
                {tabs.length > 0 &&
                  tabs.map((tab) =>
                    tab && (
                      <Box
                        key={tab.id}
                        sx={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          zIndex: tab.id === selectedFileId ? 100 : 0,
                          overflow: "hidden", // Prevent overflow issues
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            backgroundColor: "black",
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              overflow: "auto", // Enable scrolling for the CodeEditor content
                            }}
                          >
                            <CodeEditor
                              fileName={tab.name}
                              socket={socket}
                              fileId={tab.id}
                              username={Cookies.get("username")}
                              localImage={Cookies.get("image")}
                              setTabs={setTabs}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )
                  )}
              </Box>
            </>
          )}
        </div>
      </div>
    </div >
  );
}

export default Editor;