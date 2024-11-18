import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";

import "codemirror/theme/3024-day.css";
import "codemirror/theme/3024-night.css";
import "codemirror/theme/abbott.css";
import "codemirror/theme/abcdef.css";
import "codemirror/theme/ambiance-mobile.css";
import "codemirror/theme/ambiance.css";
import "codemirror/theme/ayu-dark.css";
import "codemirror/theme/ayu-mirage.css";
import "codemirror/theme/base16-dark.css";
import "codemirror/theme/base16-light.css";
import "codemirror/theme/bespin.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/cobalt.css";
import "codemirror/theme/colorforth.css";
import "codemirror/theme/darcula.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/duotone-dark.css";
import "codemirror/theme/duotone-light.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/elegant.css";
import "codemirror/theme/erlang-dark.css";
import "codemirror/theme/gruvbox-dark.css";
import "codemirror/theme/hopscotch.css";
import "codemirror/theme/icecoder.css";
import "codemirror/theme/idea.css";
import "codemirror/theme/isotope.css";
import "codemirror/theme/juejin.css";
import "codemirror/theme/lesser-dark.css";
import "codemirror/theme/liquibyte.css";
import "codemirror/theme/lucario.css";
import "codemirror/theme/material-darker.css";
import "codemirror/theme/material-ocean.css";
import "codemirror/theme/material-palenight.css";
import "codemirror/theme/material.css";
import "codemirror/theme/mbo.css";
import "codemirror/theme/mdn-like.css";
import "codemirror/theme/midnight.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/moxer.css";
import "codemirror/theme/neat.css";
import "codemirror/theme/neo.css";
import "codemirror/theme/night.css";
import "codemirror/theme/nord.css";
import "codemirror/theme/oceanic-next.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/theme/paraiso-dark.css";
import "codemirror/theme/paraiso-light.css";
import "codemirror/theme/pastel-on-dark.css";
import "codemirror/theme/railscasts.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/theme/seti.css";
import "codemirror/theme/shadowfox.css";
import "codemirror/theme/solarized.css";
import "codemirror/theme/ssms.css";
import "codemirror/theme/the-matrix.css";
import "codemirror/theme/tomorrow-night-bright.css";
import "codemirror/theme/tomorrow-night-eighties.css";
import "codemirror/theme/ttcn.css";
import "codemirror/theme/twilight.css";
import "codemirror/theme/vibrant-ink.css";
import "codemirror/theme/xq-dark.css";
import "codemirror/theme/xq-light.css";
import "codemirror/theme/yeti.css";
import "codemirror/theme/yonce.css";
import "codemirror/theme/zenburn.css";

import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/anyword-hint";

import "codemirror/keymap/sublime";


import debounce from "lodash.debounce";
import useAPI from "../hooks/api";
import { formatLogTimestamp } from "../utils/formatters";
import { Avatar, Box, selectClasses, Tooltip, Typography, Zoom } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MinimizeRoundedIcon from '@mui/icons-material/MinimizeRounded';
import FilterNoneRoundedIcon from '@mui/icons-material/FilterNoneRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded';
import { LANGUAGE_DATA } from "../utils/constants";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { toast } from "react-hot-toast";
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';

/*
    logs: [
      {
        image,
        username: "user1",  
        change: "string",
        from_line: 1,
        from_ch: 1,
        to_line: 2,
        to_ch: 2,
        log_timestamp: "2021-10-10T10:10:10.000Z"
      }
    ]
*/

import { getAvatar } from "../utils/avatar";
import { themes } from "../utils/code-editor-themes";
import { executeCode } from "../utils/api";

const CodeEditor = ({ fileName, socket, fileId, username, setTabs, localImage }) => {
  const { GET, POST } = useAPI();
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const isRemoteChange = useRef(false);
  const [users, setUsers] = useState({});
  const cursorElements = useRef({});

  const [selectedTheme, setSelectedTheme] = useState("monokai");

  const [logs, setLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const [isLogOpen, setIsLogOpen] = useState(false);
  const getFileLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const results = await GET("/project/code-editor/logs", { file_id: fileId });
      setLogs(results.data);
    } catch (error) {
    } finally {
      setIsLoadingLogs(false);
    }
  };
  useEffect(() => {
    getFileLogs();
  }, [isLogOpen]);

  // **NEW** State for the initial content
  // const [initialContent, setInitialContent] = useState("");

  // **Fetch Initial Content from Database**

  const fetchInitialContent = async () => {
    setIsLoadingContent(true);
    try {
      const response = await GET("/project/code-editor/content", { file_id: fileId });
      if (response?.data?.file_data?.content) {
        return (response.data.file_data.content); // Save content to state
      } else {
        return "";
      }
    } catch (error) {
      toast.error("Error fetching initial content:", error);
      return "";
    } finally {
      setIsLoadingContent(false);
    }
  };


  useEffect(() => {
    if (!socket) return;
    socket.emit("code-editor:load-live-users", { file_id: fileId });
    return () => {
      socket.emit("code-editor:remove-cursor", { file_id: fileId, username });
      socket.emit("code-editor:leave-file", { file_id: fileId });
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleSendAllCursors = ({ fileId: NewUserFileId }) => {
      if (fileId === NewUserFileId) {
        socket.emit("code-editor:get-all-users-cursors", { users });
      }
    }

    socket.on("code-editor:send-all-cursors", handleSendAllCursors)

    return () => {
      socket.off("code-editor:send-all-cursors", handleSendAllCursors);
    }
  }, [users]);


  useEffect(() => {
    if (!socket) return;
    socket.emit("code-editor:send-all-cursors", { fileId });
  }, [fileId]);

  useEffect(() => {
    if (!socket) return;
    const handleGetAllCursors = ({ users: cursors }) => {
      setUsers(cursors);
    }
    socket.on("code-editor:get-all-users-cursors", handleGetAllCursors);

    return () => {
      socket.off("code-editor:get-all-users-cursors", handleGetAllCursors);
    }
  }, [socket, users]);

  useEffect(() => {
    if (!socket) return;

    // Initialize CodeMirror instance
    const editor = CodeMirror.fromTextArea(editorRef.current, {
      mode: "javascript",
      theme: selectedTheme,
      keyMap: "sublime",
      lineNumbers: true,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
      },
    });

    editorInstance.current = editor;

    const setupEditor = async () => {
      const initialContent = await fetchInitialContent();
      editor.setValue(initialContent);
    };
    setupEditor();

    const handleInputRead = (cm, event) => {
      if (!cm.state.completionActive && event.text[0]?.match(/\w/)) {
        cm.showHint({
          hint: CodeMirror.hint.anyword,
          completeSingle: false,
        });
      }
    };

    editor.on("inputRead", handleInputRead);

    // Debounced function to save content to the database
    const debouncedSave = debounce((instance) => {
      const currentContent = instance.getValue();
      saveContentToDB(currentContent);
    }, 1000);

    editor.on("change", (instance, change) => {
      if (isRemoteChange.current || !change.origin || change.origin === "setValue") return;

      const newLog = {
        image: localImage,
        username,
        origin: change.origin,
        removed: change.removed.join(""),
        text: change.text.join(""),
        from_line: change.from.line,
        from_ch: change.from.ch,
        to_line: change.to.line,
        to_ch: change.to.ch,
        log_timestamp: formatLogTimestamp(new Date()),
      };

      setLogs((prevLogs) => [...prevLogs, newLog]);

      socket.emit("code-editor:send-change", { file_id: fileId, change, newLog });

      debouncedSave(instance);
    });

    const receiveChangeHandler = ({ file_id, change, newLog }) => {
      if (fileId === file_id || change.origin !== "setValue") {
        isRemoteChange.current = true;

        setLogs((prevLogs) => [...prevLogs, newLog]);
        editor.operation(() => {
          editor.replaceRange(change.text, change.from, change.to, change.origin);
        });
        isRemoteChange.current = false;
      }
    };

    socket.on("code-editor:receive-change", receiveChangeHandler);

    editor.on("cursorActivity", (instance) => {
      const cursor = editor.getCursor();
      setUsers((prevUsers) => ({
        ...prevUsers,
        [username]: cursor,
      }));
      socket.emit("code-editor:send-cursor", {
        file_id: fileId,
        username,
        position: cursor,
      });
    });

    const receiveCursorHandler = ({ file_id, username: OtherUsername, position }) => {
      if (fileId === file_id && username !== OtherUsername) {
        setUsers((prevUsers) => ({
          ...prevUsers,
          [OtherUsername]: position,
        }));
      }
    };

    const removeCursorHandler = ({ file_id, username }) => {
      if (fileId === file_id) {
        setUsers((prevUsers) => {
          const newUsers = { ...prevUsers };
          delete newUsers[username];
          return newUsers;
        });
        if (cursorElements.current[username]) {
          cursorElements.current[username].remove();
          delete cursorElements.current[username];
        }
      }
    };

    const removeUserSpecificCursor = ({ username }) => {
      setUsers((prevUsers) => {
        const newUsers = { ...prevUsers };
        delete newUsers[username];
        return newUsers;
      });
      if (cursorElements.current[username]) {
        cursorElements.current[username].remove();
        delete cursorElements.current[username];
      }
    };

    socket.on("code-editor:receive-cursor", receiveCursorHandler);
    socket.on("code-editor:remove-cursor", removeCursorHandler);
    socket.on("code-editor:remove-user-specific-cursor", removeUserSpecificCursor);

    return () => {
      if (editor) {
        editor.toTextArea(); // Clean up CodeMirror instance safely
      }
      socket.off("code-editor:receive-change", receiveChangeHandler);
      socket.off("code-editor:receive-cursor", receiveCursorHandler);
      socket.off("code-editor:remove-cursor", removeCursorHandler);
      socket.off("code-editor:remove-user-specific-cursor", removeUserSpecificCursor);

      Object.values(cursorElements.current).forEach((el) => el.remove());
      cursorElements.current = {};
    };
  }, [socket, username]);


  useEffect(() => {
    const userJoined = (data) => {
      if (!data && !data?.aUser) return;
      const { aUser, image: UserImage } = data;

      if (!aUser?.fileId || !aUser?.username || !aUser?.isActiveInTab || !aUser?.isLive || !aUser?.liveUsersTimestamp || !aUser?.projectId) return;

      const {
        file_id,
        username,
        is_active_in_tab,
        is_live,
        live_users_timestamp,
        project_id,
      } = aUser;

      setTabs((prevTabs) => {
        // First, set is_active_in_tab = false for all tabs for the specified username
        const updatedTabs = prevTabs.map((tab) => {
          return {
            ...tab,
            users: tab.users.map((u) =>
              u.username === username ? { ...u, is_active_in_tab: false } : u
            ),
          };
        });

        // Now, update or add the user in the correct tab based on file_id
        return updatedTabs.map((tab) => {
          if (tab.id === file_id) {
            // Check if the user already exists in the tab
            const userExists = tab.users.some((u) => u.username === username);

            if (userExists) {
              // Update the existing user
              return {
                ...tab,
                users: tab.users.map((u) =>
                  u.username === username
                    ? {
                      ...u,
                      is_active_in_tab,
                      is_live,
                      live_users_timestamp,
                    }
                    : u
                ),
              };
            } else {
              // Add new user
              return {
                ...tab,
                users: [
                  ...tab.users,
                  {
                    image: UserImage,
                    username,
                    is_active_in_tab,
                    is_live,
                    live_users_timestamp,
                  },
                ],
              };
            }
          }
          return tab;
        });
      });
    };

    const userLeft = ({ file_id, username }) => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === file_id
            ? {
              ...tab,
              users: tab.users.filter((user) => user.username !== username),
            }
            : tab
        )
      );
    };

    const removeActiveLiveUser = ({ username }) => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) => ({
          ...tab,
          users: tab.users.filter((user) => user.username !== username),
        }))
      );
    };

    const loadLiveUsers = ({ allUsers }) => {
      setTabs((prevTabs) => {
        // Update or add the users in the correct tab based on their file_id
        const updatedTabs = [...prevTabs];

        allUsers.forEach((aUser) => {
          const {
            image: UserImage,
            file_id,
            username,
            is_active_in_tab,
            is_live,
            live_users_timestamp,
          } = aUser;

          updatedTabs.forEach((tab) => {
            if (tab.id === file_id) {
              // Check if the user already exists in the tab
              const userExists = tab.users.some((u) => u.username === username);

              if (userExists) {
                // Update the existing user
                tab.users = tab.users.map((u) =>
                  u.username === username
                    ? {
                      ...u,
                      is_active_in_tab,
                      is_live,
                      live_users_timestamp,
                    }
                    : u
                );
              } else {
                // Add new user
                tab.users.push({
                  image: UserImage,
                  username,
                  is_active_in_tab,
                  is_live,
                  live_users_timestamp,
                });
              }
            }
          });
        });

        return updatedTabs;
      });
    };

    socket.on("code-editor:user-joined", userJoined);
    socket.on("code-editor:user-left", userLeft);
    socket.on("code-editor:remove-active-live-user", removeActiveLiveUser);
    socket.on("code-editor:load-live-users", loadLiveUsers);

    return () => {
      socket.off("code-editor:user-joined", userJoined);
      socket.off("code-editor:user-left", userLeft);
      socket.off("code-editor:remove-active-live-user", removeActiveLiveUser);
      socket.off("code-editor:load-live-users", loadLiveUsers);
    };
  }, [socket, username]);

  useEffect(() => {
    const editor = editorInstance.current;
    if (!editor) return;

    Object.entries(users).forEach(([user, position]) => {
      // if (user === username) return; // Don't show own cursor

      let cursorElement = cursorElements.current[user];

      if (!cursorElement) {
        // Create new cursor element if it doesn't exist
        cursorElement = document.createElement("div");
        cursorElement.className = "remote-cursor";
        cursorElement.style.position = "absolute";
        cursorElement.style.width = "2px";
        cursorElement.style.height = "20px";
        cursorElement.style.backgroundColor = getRandomColor(user);

        const labelElement = document.createElement("div");
        labelElement.className = "remote-cursor-label";
        labelElement.textContent = user === username ? "You" : user;
        labelElement.style.position = "absolute";
        labelElement.style.left = "0";
        labelElement.style.top = "-20px";
        labelElement.style.backgroundColor = getRandomColor(user);
        labelElement.style.color = "white";
        labelElement.style.padding = "2px 4px";
        labelElement.style.borderRadius = "3px";
        labelElement.style.fontSize = "12px";
        labelElement.style.zIndex = 9999999;

        cursorElement.appendChild(labelElement);
        editor.getWrapperElement().appendChild(cursorElement);
        cursorElements.current[user] = cursorElement;
      }

      // Update cursor position
      const cursorCoords = editor.cursorCoords(position, "local");
      cursorElement.style.left = `${cursorCoords.left + 29}px`;
      cursorElement.style.top = `${cursorCoords.top}px`;
    });
  }, [users, username]);

  const getRandomColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  };

  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleDropdown = (e) => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen((prev) => false);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    handleClose();
  }

  useEffect(() => {
    const editor = editorInstance.current;
    if (editor) { editor.setOption("theme", selectedTheme); }
  }, [selectedTheme]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Function to handle keydown event
    const handleEsc = (event) => {
      if (event.key === "Escape") handleClose();
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleEsc);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const logContainerRef = useRef(null);

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleLog = () => {
    if (isLogOpen) {
      setLogs([]);
    } else {
      getFileLogs();
    }
    setIsLogOpen((prev) => !prev);
  };
  const handleCloseLog = () => setIsLogOpen((prev) => false);

  // Scroll to the bottom whenever logs change
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const logRef = useRef(null);

  useEffect(() => {
    // Function to handle keydown event
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseLog(); // Call the function on pressing Escape
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleEsc);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleCloseLog]);


  // Function to save content to the database
  const saveContentToDB = (content) => {
    setIsLoadingSave(true);

    // Make the POST request using .then() and .catch()
    POST("/project/code-editor/save", { file_id: fileId, content })
      .then((response) => {
        // console.log("Content saved successfully:", response);
      })
      .catch((error) => {
        // console.error("Failed to save content:", error);
      })
      .finally(() => {
        setIsLoadingSave(false);
      });
  };

  // Memoized handle function to prevent unnecessary re-renders
  const handleThemeSelect = useCallback((themeName) => {
    setSelectedTheme(themeName);
    handleThemeChange(themeName);
  }, [handleThemeChange]);


  const [isRunningCode, setIsRunningCode] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeOutput, setCodeOutput] = useState({});
  const [selectLanguage, setSelectLanguage] = useState({
    language: 'javascript',
    version: '18.15.0',
    codeSnippet: `function welcome() {\n\tconsole.log("Welcome to CHAP The code editor!");\n}\n\nwelcome();\n`,
    info: 'JavaScript does not have built-in Queue and Priority Queue data structures so you may use datastructures-js/queue and datastructures-js/priority-queue instead.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
  });
  // Handle selection change
  const handleSelectLanguage = (e) => {
    const selectedLanguage = LANGUAGE_DATA.find(
      (item) => item.language === e.target.value
    );
    setSelectLanguage(selectedLanguage);
  };

  const handleRunCode = async () => {
    const { language, version } = selectLanguage;

    const sourceCode = editorInstance.current.getValue();


    if (!sourceCode || sourceCode.trim() === "") {
      toast("Code is empty",
        {
          icon: <CancelRoundedIcon />,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      return;
    }

    setIsRunningCode(true);
    setIsCodeInputOutputOpen(true);
    setCodeOutput({});

    try {
      const results = await executeCode(language, version, sourceCode, codeInput);
      setCodeOutput(results);
    } catch (error) {
      toast(error?.message || "Something went wrong!",
        {
          icon: <CancelRoundedIcon />,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    } finally {
      setIsRunningCode(false);
    }
  }

  const [isCodeInputOutputOpen, setIsCodeInputOutputOpen] = useState(false);
  const handleCloseCodeInputOutput = () => {
    setIsCodeInputOutputOpen(false);
  }

  return (
    <Box sx={{ position: "absolute", width: "100%", height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: "2px" }}>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ color: "white" }}>{fileName}</Typography>
        </Box>
        {isLoadingContent ? (
          <Box sx={{ position: "absolute", left: "50%", display: "flex", transform: "translateX(-50%)", justifyContent: "center", alignItems: "center" }}>
            <Typography sx={{ color: "white" }}>Loading Content of file....</Typography>
            <CircularProgress
              size={14}
              thickness={6}
              sx={{
                mx: 1,
                color: "white",
                '& circle': { strokeLinecap: 'round' },
              }}
            />
          </Box>
        ) :
          <Box sx={{ display: "flex", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {/* {selectLanguage.icon ?
              <Box>
                <img
                  src={selectLanguage.icon}
                  alt={selectLanguage.language + " icon"}
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  decoding="async"
                />
              </Box> : null} */}
            <select id="style-1" value={selectLanguage.language} onChange={handleSelectLanguage}>
              {LANGUAGE_DATA.map((lang, index) => (
                <option key={index} value={lang.language}>
                  {lang.language} ({lang.version})
                </option>
              ))}
            </select>
            <Box sx={{ mx: 1 }}>
              {isRunningCode ?
                <Box
                  id="run-button"
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 0,
                    margin: 0,
                    color: "white",
                    border: "none"
                  }}>
                  <CircularProgress
                    size={20}
                    thickness={6}
                    sx={{
                      color: "white",
                      '& circle': { strokeLinecap: 'round' },
                    }}
                  />
                </Box>
                :
                <Tooltip
                  title={"run"}
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontWeight: "bold",
                        bgcolor: "common.black",
                        "& .MuiTooltip-arrow": {
                          color: "common.black",
                        },
                      },
                    },
                  }}
                >
                  <Box
                    onClick={handleRunCode}
                    id="run-button"
                    sx={{ "&:hover": { bgcolor: "white", color: "black" }, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "6px", fontWeight: "bold", padding: 0, margin: 0, color: "white", border: "1px solid white" }}>
                    <PlayArrowRoundedIcon />
                  </Box>
                </Tooltip>
              }
            </Box>
          </Box>
        }
        <Box sx={{ position: "relative", display: "flex" }}>
          {!isLoadingSave ?
            <Box sx={{ px: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Typography sx={{ color: "white", mx: 1 }}>Saved</Typography>
              <CloudDoneRoundedIcon sx={{ color: "white" }} />
            </Box> :
            <Box sx={{ px: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Typography sx={{ color: "white", mx: 1 }}>Saving...</Typography>
              <CircularProgress
                size={14}
                thickness={6}
                sx={{
                  color: "white",
                  '& circle': { strokeLinecap: 'round' },
                }}
              />
            </Box>
          }
          <Box sx={{ px: 1 }}>
            <HistoryRoundedIcon
              onClick={toggleLog}
              sx={{ p: "1px", cursor: "pointer", color: "white", borderRadius: "4px", "&:hover": { color: "black", bgcolor: "#CCCCCC" } }}
            />
          </Box>
          <select id="style-1" value={selectedTheme} onChange={(e) => handleThemeSelect(e.target.value)}>
            {themes.map((theme, index) => (
              <option key={index} value={theme.name}>{theme.name}</option>
            ))}
          </select>
        </Box>
      </Box>

      <div
        style={{
          border: "1px solid black",
          padding: "2px",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <textarea ref={editorRef}>
        </textarea>
        <Box
          onClick={() => {
            setIsCodeInputOutputOpen(true);
            setIsLogOpen(false);
          }}
          sx={{
            cursor: "pointer",
            visibility: isCodeInputOutputOpen ? "hidden" : "visible",
            position: "fixed",
            p: 1,
            m: 1,
            bottom: 10,
            right: 10,
            bgcolor: "white",
            borderRadius: "4px",
            border: "1px solid black"
          }}>
          <CodeRoundedIcon sx={{ color: "#333333" }} />
        </Box>
        <Box
          sx={{
            visibility: isCodeInputOutputOpen ? "visible" : "hidden",
            position: "fixed",
            p: 1,
            bottom: 0,
            right: 0,
            zIndex: 99999,
            maxWidth: "400px",
            width: "100%", // Adjust width as needed
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "400px",
            width: "100%", // Adjust width as needed
            height: "100vh",
            borderRadius: "8px", // Rounded corners for top-left
            border: "1px solid #444",
            bgcolor: "#F2F2F2",
          }}>

            {/* Input Section */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight="bold" sx={{ color: "black", py: 1, mx: 1 }}>Input</Typography>
                <CloseRoundedIcon
                  onClick={handleCloseCodeInputOutput}
                  sx={{
                    p: '4px',
                    m: '6px',
                    cursor: 'pointer',
                    fontWeight: "bold",
                    color: 'black',
                    borderRadius: '4px',
                    '&:hover': { bgcolor: '#CCCCCC' },
                  }}
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  px: "8px",
                }}
              >
                <textarea
                  placeholder="Inputs"
                  id="style-1"
                  style={{
                    borderRadius: "6px",
                    fontWeight: "bold",
                    width: "100%",
                    height: "100%",
                    resize: "none",
                    padding: "8px",
                    boxSizing: "border-box",
                    // backgroundColor: "#222",
                    color: "black",
                    border: "1px solid #444",
                  }}
                  name="code-input"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                />
              </Box>
            </Box>

            {/* Output Section */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                my: 1
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: "8px",
                  py: "4px",
                }}
              >
                <Typography fontWeight="bold" sx={{ color: "black" }}>Output</Typography>
                {codeOutput.stderr && (
                  <>
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      sx={{
                        borderRadius: "4px",
                        px: 1,
                        mx: 1,
                        color: "black",
                        bgcolor: "white",
                      }}
                    >
                      Code: {codeOutput.code}
                    </Typography>
                    {codeOutput.signal && <Typography
                      variant="caption"
                      fontWeight="bold"
                      sx={{
                        borderRadius: "4px",
                        px: 1,
                        color: "black",
                        bgcolor: "white",
                      }}
                    >
                      Signal: {codeOutput.signal}
                    </Typography>}
                  </>
                )}
                {codeOutput.stdout && !codeOutput.stderr && !isRunningCode &&
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{
                      borderRadius: "4px",
                      px: 1,
                      mx: 1,
                      color: "black",
                      bgcolor: "white",
                    }}
                  >
                    Success
                  </Typography>}
                {!codeOutput.stdout && codeOutput.stderr && !isRunningCode &&
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    sx={{
                      borderRadius: "4px",
                      px: 1,
                      color: "black",
                      bgcolor: "white",
                    }}
                  >
                    Failed
                  </Typography>}
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  px: "8px",
                }}
              >
                <textarea
                  id="style-1"
                  placeholder={isRunningCode ? "Running..." : "Output"}
                  readOnly
                  name="code-output"
                  style={{
                    borderRadius: "6px",
                    fontWeight: "bold",
                    width: "100%",
                    height: "100%",
                    resize: "none",
                    padding: "8px",
                    boxSizing: "border-box",
                    color: codeOutput.stderr ? "#EE6055" : "#248277",
                    border: "1px solid #444",
                  }}
                  value={isRunningCode ? "Running..." :
                    codeOutput.stderr
                      ? codeOutput.output.substring(
                        codeOutput.output.indexOf("\n") + 1
                      )
                      : codeOutput.output
                  }
                />
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Logs */}
        <Box ref={logRef} sx={{ display: isLogOpen ? "block" : "none", position: "absolute", top: 0, right: 0, zIndex: 99999, bgcolor: "white", p: 1, borderRadius: "10px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #404040" }}>
            <Typography variant="h6">Logs</Typography>
            <Box>
              {isMinimized ?
                <OpenInFullRoundedIcon onClick={() => setIsMinimized(false)} fontSize="small" sx={{ p: "1px", cursor: "pointer", color: "black", borderRadius: "4px", "&:hover": { bgcolor: "#CCCCCC" } }} />
                :
                <MinimizeRoundedIcon onClick={() => setIsMinimized(true)} fontSize="small" sx={{ p: "1px", cursor: "pointer", color: "black", borderRadius: "4px", "&:hover": { bgcolor: "#CCCCCC" } }} />
              }
              {isMaximized ?
                <CheckBoxOutlineBlankRoundedIcon onClick={() => setIsMaximized(false)} fontSize="small" sx={{ p: "1px", cursor: "pointer", color: "black", borderRadius: "4px", "&:hover": { bgcolor: "#CCCCCC" } }} />
                :
                <FilterNoneRoundedIcon onClick={() => setIsMaximized(true)} fontSize="small" sx={{ p: "2px", cursor: "pointer", color: "black", borderRadius: "4px", "&:hover": { bgcolor: "#CCCCCC" } }} />
              }
              <CloseRoundedIcon onClick={() => setIsLogOpen(false)} fontSize="small" sx={{ p: "1px", cursor: "pointer", color: "black", borderRadius: "4px", "&:hover": { bgcolor: "#CCCCCC" } }} />
            </Box>
          </Box>
          <div id="style-1" ref={logContainerRef} style={{ minWidth: isMaximized ? "500px" : "300px", minHeight: isMinimized ? 0 : isMaximized ? "500px" : "200px", maxHeight: isMinimized ? 0 : isMaximized ? "500px" : "300px", width: "100%", overflowY: "auto" }}>
            {isLoadingLogs ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: "100px" }}>
                <CircularProgress
                  size={30}
                  thickness={6}
                  sx={{
                    color: "black",
                    '& circle': { strokeLinecap: 'round' },
                  }}
                />
              </Box>
            ) : (logs.length === 0 ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: "100px" }}>
                  <Typography variant="h6" sx={{ color: "grey" }}>No logs available</Typography>
                </Box>
              </>
            ) : (logs.map((log, index) => (
              <Box key={index} sx={{ display: "flex", py: 1, alignItems: "flex-start", width: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={
                      Cookies.get("username") === log.username
                        ? "You"
                        : log.username
                    }
                    placement="bottom"
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: "common.black",
                          "& .MuiTooltip-arrow": {
                            color: "common.black",
                          },
                        },
                      },
                    }}
                  >
                    <Avatar
                      sx={{ width: 42, height: 42, border: "1px solid black", }}
                      alt={log.username}
                      src={getAvatar(log.image)}
                      imgProps={{
                        crossOrigin: "anonymous",
                        referrerPolicy: "no-referrer",
                        decoding: "async",
                      }}
                    />
                  </Tooltip>
                </Box>
                <Box sx={{ px: 1, width: "100%" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: log.removed ? "#ee6055" : "#358f80", borderRadius: "6px", px: "6px", marginBottom: "4px" }}>
                    <Typography
                      sx={{
                        color: "white",
                        overflow: "hidden",        // Hide overflow text
                        textOverflow: "ellipsis",  // Show ellipsis when text overflows
                        whiteSpace: "nowrap",
                        maxWidth: isMaximized ? "500px" : "200px",         // Set a fixed width for truncation (adjust as needed)
                      }}>
                      "{log.text || log.removed}"
                    </Typography>
                    <Typography sx={{ color: "white" }}>{log.origin}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", bgcolor: "#F2F2F2", borderRadius: "6px", px: "4px" }}>
                      <Typography variant="caption" sx={{ fontWeight: "bold", color: "#737373", py: 0, fontSize: "12px" }}>from</Typography>
                      <Typography variant="caption" sx={{ color: "grey", mx: 1 }}>line: {log.from_line}</Typography>
                      <Typography variant="caption" sx={{ color: "grey" }}>char: {log.from_ch}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", bgcolor: "#F2F2F2", borderRadius: "6px", px: "4px" }}>
                      <Typography variant="caption" sx={{ fontWeight: "bold", color: "#737373", py: 0, fontSize: "12px" }}>to</Typography>
                      <Typography variant="caption" sx={{ color: "grey", mx: 1 }}>line: {log.to_line}</Typography>
                      <Typography variant="caption" sx={{ color: "grey" }}>char: {log.to_ch}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "grey" }}>{log.log_timestamp}</Typography>
                  </Box>
                </Box>
              </Box>
            ))))}
          </div>
        </Box>
      </div >
    </Box >
  );
};

export default CodeEditor;
