import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Utils
import { getAvatar } from "../utils/avatar";

// Material UI Styles
import { styled } from '@mui/material/styles';

// Material UI Components
import { Grid, Avatar, Tooltip, Zoom, Badge, Typography, Box } from "@mui/material";

// Material UI Icons
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

// CSS
import "../CSS/Tabs.css";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Tabs = (props) => {
  const { tabs, setTabs, selectedFileId, handleCloseTab, handleFileClick } =
    props;

  // Function to handle the end of a drag event
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If there's no destination, do nothing
    if (!destination) return;

    // Reorder the tabs array
    const reorderedTabs = Array.from(tabs);
    const [movedTab] = reorderedTabs.splice(source.index, 1);
    reorderedTabs.splice(destination.index, 0, movedTab);

    setTabs(reorderedTabs);
  };

  return (
    <Grid sx={{ bgcolor: "#F0F0F0" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                display: "flex",
                overflow: "auto",
                ...provided.droppableProps.style,
              }}
            >
              {tabs.map((tab, index) => (
                <Draggable key={tab.id} draggableId={tab.id} index={index}>
                  {(provided) => (
                    <div
                      onMouseEnter={() => { document.getElementById(tab.id).style.visibility = "visible"; }}
                      onMouseLeave={() => { document.getElementById(tab.id).style.visibility = "hidden"; }}
                      onClick={() => handleFileClick(tab)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        position: "relative",
                        padding: "6px",
                        margin: "2px 1px",
                        border: "1px solid black",
                        borderRadius: "6px",
                        background:
                          selectedFileId === tab.id ? "#333333" : "#F2F2F2",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <Box>
                        <Typography sx={{ color: selectedFileId === tab.id ? "white" : "black" }}>{tab.name}</Typography>
                      </Box>
                      <div className="dropdown">
                        <Box id={tab.id} sx={{ visibility: "hidden" }}>
                          <MoreHorizRoundedIcon
                            className="dropbtn"
                            fontSize="small"
                            sx={{
                              color: selectedFileId === tab.id ? "white" : "black",
                              cursor: "pointer",
                              "&:hover": { bgcolor: "#8C8C8C", borderRadius: 2 }
                            }}
                          />
                        </Box>
                        <div className="dropdown-content">
                          <Box id={`tabs-live-users-${tab.id}`} >
                            {tab.users.map((user, index) =>
                              user.is_live && (
                                <div key={index}>
                                  <Box sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                                    {user.is_active_in_tab ? (
                                      <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                      >
                                        <Tooltip
                                          key={index}
                                          TransitionComponent={Zoom}
                                          title={
                                            localStorage.getItem("username") === user.username
                                              ? "You"
                                              : user.username
                                          }
                                          placement="top"
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
                                            alt={user.username}
                                            src={getAvatar(user.image)}
                                            imgProps={{
                                              crossOrigin: "anonymous",
                                              referrerPolicy: "no-referrer",
                                              decoding: "async",
                                            }}
                                          />
                                        </Tooltip>
                                      </StyledBadge>
                                    ) : (
                                      <Tooltip
                                        key={index}
                                        TransitionComponent={Zoom}
                                        title={
                                          localStorage.getItem("username") === user.username
                                            ? "You"
                                            : user.username
                                        }
                                        placement="top"
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
                                          alt={user.username}
                                          src={getAvatar(user.image)}
                                          imgProps={{
                                            crossOrigin: "anonymous",
                                            referrerPolicy: "no-referrer",
                                            decoding: "async",
                                          }}
                                        />
                                      </Tooltip>)}
                                    <Typography fontWeight="bold" sx={{ px: 1 }}>{user.username}</Typography>
                                  </Box>
                                </div>
                              )
                            )}
                          </Box>
                        </div>
                      </div>
                      <CloseIcon fontSize="small"
                        sx={{
                          color: selectedFileId === tab.id ? "white" : "black",
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#8C8C8C", borderRadius: 2 }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseTab(tab.id);
                        }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Grid >
  );
};

export default Tabs;
