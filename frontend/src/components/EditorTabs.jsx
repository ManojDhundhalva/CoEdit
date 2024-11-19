import React, { useEffect } from "react";
import {
  Tab,
  Box,
  Tabs,
  Zoom,
  Avatar,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import TextEditor from "./TextEditor";
import { green, grey } from "@mui/material/colors";

const EditorTabs = ({
  socket,
  allFiles,
  selectedTab,
  handleTabChange,
  handleCloseTab,
  selectedFileId,
  setAllFiles,
  openedTabs,
}) => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ px: 1 }}
      >
        {openedTabs.map((tab, index) => {
          const matchingFile = allFiles.find(
            (file) => file.file_id === tab.file_id
          );

          if (!matchingFile) return null;

          return (
            <Tab
              sx={{
                p: 1,
                m: "1px",
                marginTop: "5px",
                border: "1px solid transparent",
                borderRadius: 2,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                bgcolor: selectedTab === index ? "#e6e6e6" : "transparent",
                textTransform: "none",
              }}
              key={tab.file_id}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ArticleRoundedIcon />
                  {matchingFile.file_name + matchingFile.file_extension}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {matchingFile.users.map(
                      ({ username, is_active_in_tab, is_live }, i) =>
                        is_live ? (
                          <Tooltip
                            key={i}
                            TransitionComponent={Zoom}
                            title={username}
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
                            <IconButton color="inherit">
                              <Avatar
                                sx={{
                                  border: is_active_in_tab
                                    ? "2px double #0077b6"
                                    : "2px double grey",
                                  bgcolor: is_active_in_tab
                                    ? username === localStorage.getItem("username")
                                      ? green[500]
                                      : green[200]
                                    : grey,
                                }}
                              >
                                {username[0].toUpperCase()}
                              </Avatar>
                            </IconButton>
                          </Tooltip>
                        ) : null
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab(index);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            />
          );
        })}
      </Tabs>

      {openedTabs.map((tab, index) => (
        <Box key={index}>
          <TextEditor
            socket={socket}
            file_id={tab.file_id}
            setAllFiles={setAllFiles}
            selectedFileId={selectedFileId}
          />
        </Box>
      ))}
    </Box>
  );
};

export default EditorTabs;
