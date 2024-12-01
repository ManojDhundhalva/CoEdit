import React, { useState, useEffect, useRef } from "react";

// Hooks
import useAPI from "../hooks/api";

// Utils
import { DateFormatter } from "../utils/formatters";

// Material UI Components
import { Zoom, Tooltip, Typography, Box } from "@mui/material/";

// Material UI Icons
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const CustomDialog = ({ open, handleClose, date, name }) => {

  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();  // Close the modal if clicking outside of it
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  useEffect(() => {
    // Function to handle keydown event
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleClose(); // Call the function on pressing Escape
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleEsc);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose]);

  if (!open) return null;

  return (
    <Box ref={modalRef} sx={{
      minWidth: "300px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "fixed",
      top: "50%",
      left: "50%",
      zIndex: 1000,
      bgcolor: "rgb(245, 245, 245)",
      transform: "translate(-50%, -50%)",
      p: 3,
      borderRadius: "10px",
      border: "1px solid #8C8C8C",
    }}>
      <Box onClick={handleClose} sx={{
        m: 1,
        position: "absolute",
        top: 0,
        right: 0,
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <button style={{ padding: 0 }}>
          <CloseRoundedIcon fontSize="small" sx={{ color: "black" }} />
        </button>
      </Box>
      <Box sx={{ m: 3 }}>
        <Typography fontWeight="bold" fontSize="xx-large" sx={{ color: "black" }}>Info</Typography>
      </Box>
      <Box sx={{ m: 2 }}>
        <Typography sx={{ color: "black" }}>
          Name : {name}
        </Typography>
        <Typography sx={{ color: "black" }}>
          Created On : {DateFormatter(date)}
        </Typography>
      </Box>
    </Box >
  );
};


const Folder = (props) => {
  const { POST } = useAPI();

  const {
    explorer,
    handleInsertNode,
    handleDeleteNode,
    handleFileClick,
    selectedFileId,
    makeExpandFolderParent,
    paddingLeft,
  } = props;

  const [expand, setExpand] = useState(explorer.expand || false);
  const [showInput, setShowInput] = useState({
    isVisible: false,
    isFolder: null,
  });

  const handleNewFolder = (e, isFolder) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput((prev) => ({ isVisible: true, isFolder }));
  };

  const onAddFolder = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      handleInsertNode(explorer.id, e.target.value, showInput.isFolder);
      setShowInput({ ...showInput, isVisible: false });
    }
  };

  const onFileClick = (file) => {
    if (typeof handleFileClick === "function") {
      makeExpandFolderParent();
      setExpand((prev) => true);
      handleFileClick(file);
    }
  };

  const makeExpand = () => {
    makeExpandFolderParent();
    setExpand((prev) => true);
  };

  useEffect(() => {
    const setExpandData = async () => {
      const setExpandDataObj = { expand, file_tree_id: explorer.id };
      try {
        const results = await POST("/project/set-expand-data", setExpandDataObj);
      } catch (error) {
      }
    };

    setExpandData();
  }, [expand]);

  useEffect(() => {
    if (selectedFileId === explorer.id) {
      makeExpandFolderParent();
    }
  }, [selectedFileId]);

  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [iconVisible, setIconVisible] = useState(false);

  const handleClick = (e) => { e.stopPropagation(); setIsInfoVisible((prev) => !prev); };

  const handleClose = () => { setIsInfoVisible(false); };

  if (explorer.isFolder) {
    return (
      <>
        <CustomDialog open={isInfoVisible} handleClose={handleClose} date={explorer.fileTreeTimestamp} name={explorer.name} />
        <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            {Array.from({ length: paddingLeft }, (_, index) => (
              <Box key={index} sx={{ display: "flex", borderLeft: "2px solid black", marginLeft: "8px" }}>
                &nbsp;
              </Box>
            ))}
            <Box
              onMouseEnter={() => setIconVisible(true)}
              onMouseLeave={() => setIconVisible(false)}
              onClick={() => setExpand((prev) => !expand)}
              sx={{
                borderTopLeftRadius: explorer.parentId ? "5px" : 0,
                borderBottomLeftRadius: explorer.parentId ? "5px" : 0,
                cursor: "pointer",
                background: "#404040",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Box>
                  {expand ? (
                    <KeyboardArrowDownRoundedIcon />
                  ) : (
                    <KeyboardArrowRightRoundedIcon />
                  )}
                </Box>
                <Box>
                  {expand ? (
                    <i className="fa-regular fa-folder-open"></i>
                  ) : (
                    <i className="fa-solid fa-folder"></i>
                  )}
                  {/* <FolderRoundedIcon sx={{ color: "white" }} /> */}
                </Box>
                <Box>
                  <Typography sx={{ px: 1 }}>
                    {explorer.name}
                  </Typography>
                </Box>
              </Box>
              {iconVisible ? (
                <Box>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={"New Folder"}
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
                    <FolderOutlinedIcon fontSize="small" onClick={(e) => { e.stopPropagation(); handleNewFolder(e, true) }}
                      sx={{ p: "1px", cursor: "pointer", color: "white", borderRadius: 2, "&:hover": { bgcolor: "black" } }} />
                  </Tooltip>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={"New File"}
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
                    <InsertDriveFileOutlinedIcon fontSize="small" onClick={(e) => { e.stopPropagation(); handleNewFolder(e, false) }}
                      sx={{ p: "1px", cursor: "pointer", color: "white", borderRadius: 2, "&:hover": { bgcolor: "black" } }} />
                  </Tooltip>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={"Delete"}
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
                    <DeleteOutlineOutlinedIcon fontSize="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(explorer.id);
                      }}
                      sx={{ p: "1px", cursor: "pointer", color: "white", borderRadius: 2, "&:hover": { bgcolor: "black" } }} />
                  </Tooltip>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title={"Info"}
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
                    <InfoOutlinedIcon fontSize="small" onClick={handleClick}
                      sx={{ p: "1px", cursor: "pointer", color: "white", borderRadius: 2, "&:hover": { bgcolor: "black" } }} />
                  </Tooltip>
                </Box>
              ) : null}
            </Box>
          </Box>
          <div style={{ display: expand ? "block" : "none" }}>
            {showInput.isVisible && (
              <div style={{ display: "flex" }}>
                {Array.from({ length: paddingLeft + 1 }, (_, index) => (
                  <Box key={index} sx={{ display: "flex", borderLeft: "2px solid black", marginLeft: "8px" }}>
                    &nbsp;
                  </Box>
                ))}
                <Box sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  borderTopLeftRadius: "5px",
                  borderBottomLeftRadius: "5px",
                  width: "100%", display: "flex",
                  px: showInput.isFolder ? "4px" : 0,
                  bgcolor: showInput.isFolder ? "#404040" : "transparent"
                }}>
                  <Box>
                    {
                      showInput.isFolder ?
                        <Box>
                          <FolderRoundedIcon sx={{ color: "white" }} />
                        </Box>
                        : <Box>
                          <DescriptionRoundedIcon sx={{ color: "black" }} />
                        </Box>
                    }
                  </Box>
                  <input
                    style={{ width: "100%", margin: "4px" }}
                    type="text"
                    onKeyDown={onAddFolder}
                    onBlur={() => setShowInput({ ...showInput, isVisible: false })}
                    autoFocus
                  />
                </Box>
              </div>
            )}
            {explorer.items.map((exp) => (
              <Folder
                key={exp.id}
                explorer={exp}
                handleInsertNode={handleInsertNode}
                handleDeleteNode={handleDeleteNode}
                handleFileClick={handleFileClick}
                selectedFileId={selectedFileId}
                makeExpandFolderParent={makeExpand}
                paddingLeft={paddingLeft + 1}
              />
            ))}
          </div>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <CustomDialog open={isInfoVisible} handleClose={handleClose} date={explorer.fileTreeTimestamp} name={explorer.name} />
        <Box sx={{ display: "flex" }}>
          <Box sx={{ display: "flex" }}>
            {Array.from({ length: paddingLeft }, (_, index) => (
              <Box key={index} sx={{ display: "flex", borderLeft: "2px solid black", marginLeft: "8px" }}>
                &nbsp;
              </Box>
            ))}
          </Box>
          <Box
            onMouseEnter={() => setIconVisible(true)}
            onMouseLeave={() => setIconVisible(false)}
            sx={{
              display: "flex", justifyContent: "space-between",
              bgcolor: selectedFileId === explorer.id ? "#D9D9D9" : "transparent",
              borderTopLeftRadius: "5px",
              borderBottomLeftRadius: "5px",
              width: "100%",
              "&:hover": {
                bgcolor: "#D9D9D9",
              }
            }}
          >
            <Box
              onClick={() => onFileClick({ id: explorer.id, name: explorer.name, users: [] })}
              style={{
                display: "flex",
                width: "100%",
                cursor: "pointer",
                color: "black",
              }}
            >
              <Box>
                <DescriptionRoundedIcon sx={{ color: "black" }} />
              </Box>
              <Box>
                <Typography>
                  {explorer.name}
                </Typography>
              </Box>
            </Box>
            {iconVisible ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip
                  TransitionComponent={Zoom}
                  title={"Delete"}
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

                  <DeleteOutlineOutlinedIcon onClick={() => handleDeleteNode(explorer.id)} fontSize="small"
                    sx={{ p: "1px", cursor: "pointer", color: "black", borderRadius: 2, "&:hover": { bgcolor: "#E6E6E6" } }} />
                </Tooltip>
                <Tooltip
                  TransitionComponent={Zoom}
                  title={"Info"}
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
                  <InfoOutlinedIcon fontSize="small" onClick={handleClick}
                    sx={{ p: "1px", cursor: "pointer", color: "black", borderRadius: 2, "&:hover": { bgcolor: "#E6E6E6" } }} />
                </Tooltip>
              </Box>) : null}
          </Box>
        </Box>
      </>
    );
  }
};

export default Folder;
