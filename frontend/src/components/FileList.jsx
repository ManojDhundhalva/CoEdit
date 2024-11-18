import React, { useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Tooltip,
  Zoom,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAPI from "../hooks/api";

const getExtension = (type) => {
  if (type === "docs") return ".doc";
  return ".txt";
};

const FileList = ({ allFiles, onFileClick, selectedFileId, getAllFiles }) => {
  const [isSidebarExpanded, setSidebarExpanded] = React.useState(true);
  const [newFile, setNewFile] = useState("");
  const [fileType, setFileType] = useState("text");
  const { projectId } = useParams();
  const { POST } = useAPI();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  const createNewFile = async () => {
    const newFileData = {
      newFile,
      projectId,
      extension: getExtension(fileType),
    };
    try {
      await POST("/project/create-a-new-file", newFileData);
      // console.log(results.data);
      getAllFiles();
      toast.success(`File Created`);
    } catch (err) {
      toast.error("NOT ADDED");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            border: "none",
            borderRadius: 3, // Optional: Set border-radius
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)", // Custom box shadow
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">Create New File</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              color="primary"
              value={newFile}
              onChange={(e) => {
                setNewFile((prev) => e.target.value);
              }}
              id="new-file"
              label="New File"
              placeholder="File Name"
              variant="outlined"
              fullWidth
              size="small"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TextFieldsRoundedIcon sx={{ color: "#1976D2" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                m: 1,
                width: "380px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  fontWeight: "bold",
                },
              }}
            />
            <Grid>
              <Grid
                onClick={() => {
                  setFileType((prev) => "text");
                }}
                sx={{
                  m: 1,
                  color: fileType === "text" ? "#589DE0" : "grey",
                  border:
                    fileType === "text"
                      ? "2px solid #589DE0"
                      : "2px solid rgb(200, 200, 200)",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <AssignmentRoundedIcon
                  fontSize="large"
                  color="primary"
                  sx={{ m: 2 }}
                />
                <Typography fontWeight="bold" fontSize="large">
                  Text
                </Typography>
              </Grid>
              <Grid
                onClick={() => {
                  setFileType((prev) => "docs");
                }}
                sx={{
                  m: 1,
                  color: fileType === "docs" ? "#589DE0" : "grey",
                  border:
                    fileType === "docs"
                      ? "2px solid #589DE0"
                      : "2px solid rgb(200, 200, 200)",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <DescriptionRoundedIcon
                  fontSize="large"
                  color="primary"
                  sx={{ m: 2 }}
                />
                <Typography fontWeight="bold" fontSize="large">
                  Docs
                </Typography>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            // variant="outlined"
            variant="text"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              createNewFile();
            }}
            variant="contained"
            autoFocus
            sx={{ borderRadius: 2 }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          width: isSidebarExpanded ? "200px" : "60px",
          borderRight: "1px solid gray",
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isSidebarExpanded ? "flex-start" : "center",
            }}
          >
            <IconButton aria-label="toggle-sidebar" onClick={toggleSidebar}>
              <MenuRoundedIcon />
            </IconButton>
            {isSidebarExpanded && (
              <Typography variant="h6" sx={{ marginLeft: "10px" }}>
                Files
              </Typography>
            )}
          </Box>
          {isSidebarExpanded && (
            <IconButton
              sx={{ bgcolor: "#F5F5F5" }}
              aria-label="toggle-sidebar"
              onClick={handleClickOpen}
            >
              <AddRoundedIcon />
            </IconButton>
          )}
        </Box>

        {allFiles.map((file, index) => (
          <Tooltip
            key={index}
            TransitionComponent={Zoom}
            title={
              isSidebarExpanded ? "" : file.file_name + file.file_extension
            }
            placement="right"
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
            <Box
              sx={{
                m: 1,
                display: "flex",
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f0f0f0" },
                justifyContent: isSidebarExpanded ? "flex-start" : "center",
                backgroundColor:
                  file.file_id === selectedFileId ? "#e6e6e6" : "transparent", // Highlight selected file
                borderRadius: 2, // Optional: to match typical UI style
              }}
              onClick={() => onFileClick(file)}
            >
              <ArticleRoundedIcon color="primary" />
              {isSidebarExpanded && (
                <Typography sx={{ marginLeft: "10px" }}>
                  {file.file_name + file.file_extension}
                </Typography>
              )}
            </Box>
          </Tooltip>
        ))}
      </Box>
    </>
  );
};

export default FileList;
