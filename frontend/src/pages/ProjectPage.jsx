import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Components
import User from "../components/User";

// Hooks
import useAPI from "../hooks/api";

// Contexts
import { useUser } from "../context/user";

// Utils
import { getAvatar } from "../utils/avatar";
import { formatTimestamp } from "../utils/formatters";
import { isValidProjectName } from "../utils/validation"

// Material-UI Components
import {
  Box,
  Zoom,
  Avatar,
  Tooltip,
  Skeleton,
  Container,
  TextField,
  InputBase,
  IconButton,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

// Material-UI Icons
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';// Example icon
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

const CustomDialog = ({ open, handleClose, setAllProjects }) => {

  const { POST } = useAPI();

  const modalRef = useRef(null);
  const projectNameControllerRef = useRef(null);

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [justVerify, setJustVerify] = useState(false);
  const [isValidProjectNameLoading, setIsValidProjectNameLoading] = useState(false);
  const [projectNameError, setProjectNameError] = useState(false);

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

  const addProject = async (e) => {
    e.preventDefault();
    setJustVerify(true);

    if (projectName.trim() === "") return;

    setIsCreatingProject(true);
    try {
      const results = await POST("/project/add-project", { projectName: projectName.trim() });
      setProjectName("");
      setAllProjects(results.data.projects);
      toast(results?.data?.message || "Added Successfully",
        {
          icon: <CheckCircleRoundedIcon />,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      handleClose();
    } catch (error) {
      toast(error.response?.data?.message || "Something went wrong!",
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
      setIsCreatingProject(false);
    }
  };

  const handleChangeProjectName = async (e) => {

    if (!isValidProjectName(e.target.value)) return;
    if (e.target.value.length >= 255) return;

    setJustVerify((prev) => false);
    setProjectName(e.target.value)

  }

  return (
    <Box ref={modalRef} sx={{
      minWidth: "360px",
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
      // boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
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
        <Typography fontWeight="bold" fontSize="xx-large">Create Project</Typography>
      </Box>
      <form onSubmit={addProject} style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Box sx={{ m: 2, display: "flex", width: "100%", px: 2 }}>
          <TextField
            autoFocus
            value={projectName}
            onChange={handleChangeProjectName}
            id="project-name"
            label="Project Name"
            placeholder="Project Name"
            variant="outlined"
            fullWidth
            required
            size="small"
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FolderRoundedIcon sx={{ color: "#333333" }} />
                </InputAdornment>
              ),
            }}
            error={
              justVerify && (projectName === "" || projectName.length >= 255)
            }
            helperText={
              justVerify &&
              (projectName === ""
                ? "This field cannot be empty."
                : projectName.length >= 255 ? "Project Name is too long." : "")
            }
            sx={{
              color: "black",
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                fontWeight: "bold",
                "&.Mui-focused fieldset": {
                  borderColor: "black", // Keep the border color when focused
                },
              },
              "& .MuiInputLabel-root": {
                color: "black", // Change the label color
                "&.Mui-focused": {
                  color: "black", // Change the label color
                },
              },
            }}
          />
        </Box>
        <Box sx={{ m: 1 }}>
          <button type="submit" onClick={addProject} style={{ fontWeight: "bold" }}>
            {isCreatingProject ? (
              <>
                Creating... &nbsp;&nbsp;
                <CircularProgress size={20} thickness={6}
                  sx={{
                    color: "black",
                    '& circle': { strokeLinecap: 'round' },
                  }}
                />
              </>
            ) : ("Create")}
          </button>
        </Box>
      </form>
    </Box >
  );
};

function ProjectPage() {
  const { GET, POST } = useAPI();
  const navigate = useNavigate();
  const { userInfo } = useUser();

  const [filteredProjects, setFilteredProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isFetchingProjectsLoading, setIsFetchingProjectsLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleMenuToggle = (e, index) => {
    e.stopPropagation();
    document.getElementById(`menu-items-${index}`).style.display = document.getElementById(`menu-items-${index}`).style.display === "block" ? "none" : "block";
  };

  const handleInputChange = (e) => setSearchValue(e.target.value);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsFetchingProjectsLoading(true);
      try {
        const results = await GET("/project/get-all-projects");
        setAllProjects(results.data);
      } catch (error) {
        toast(error.response?.data?.message || "Something went wrong!",
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
        setIsFetchingProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Add a useEffect to listen for "Ctrl + /" and focus the search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        document.getElementById("search").focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClickOutside = (event) => {
    document.querySelectorAll(".menu-items").forEach((menu) => {
      if (menu && !menu.contains(event.target)) {
        menu.style.display = "none";
      }
    });
  };

  const handleEscapePress = (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".menu-items").forEach((menu) => {
        if (menu) {
          menu.style.display = "none";
        }
      });
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapePress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, []);

  const [isAscending, setIsAscending] = useState(true);
  const sortProjectsByName = () => {
    const sortedProjects = [...allProjects].sort((a, b) => {
      return isAscending
        ? a.project_name.localeCompare(b.project_name)
        : b.project_name.localeCompare(a.project_name);
    });
    setAllProjects(sortedProjects);
    setIsAscending(!isAscending);
  };


  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isProjectNameEditMode, setIsProjectNameEditMode] = useState("");

  const toggleProfile = (e) => {
    e.stopPropagation();
    setIsProfileVisible((prev) => !prev);
  }
  const handleCloseProfile = () => setIsProfileVisible(false);

  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        handleCloseProfile();  // Close the modal if clicking outside of it
      }
    }

    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleCloseProfile]);

  useEffect(() => {
    // Function to handle keydown event
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseProfile(); // Call the function on pressing Escape
      }
    };

    // Add event listener for keydown
    document.addEventListener("keydown", handleEsc);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleCloseProfile]);

  // Use effect to filter projects based on searchValue
  useEffect(() => {
    const filtered = allProjects.filter(project =>
      project.project_name.toLowerCase().startsWith(searchValue.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchValue, allProjects]); // Depend on searchValue and allProjects

  const editMode = useRef(null);
  useEffect(() => {
    // Function to handle clicks outside the component
    const handleClickOutside = (event) => {
      if (editMode.current && !editMode.current.contains(event.target)) {
        setIsProjectNameEditMode("");  // Set state to true when clicked outside
      }
    };

    // Add event listener for clicks on the document
    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const [isLoadingSaveProjectName, setIsLoadingSaveProjectName] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleSaveProjectName = async (e, project_id) => {
    e.stopPropagation();
    setIsLoadingSaveProjectName(true);
    try {

      await POST("/project/update/project-name", { project_id, project_name: newProjectName });
      setAllProjects(prev =>
        prev.map(project =>
          project.project_id === project_id
            ? { ...project, project_name: newProjectName }
            : project
        )
      );
      toast("Updated Successfully",
        {
          icon: <CheckCircleRoundedIcon />,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
    } catch (error) {
      toast(error.response?.data?.message || "Something went wrong!",
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
      setIsLoadingSaveProjectName(false);
      setIsProjectNameEditMode("");
    }
  }

  return (
    <>
      <CustomDialog open={openDialog} handleClose={handleCloseDialog} setAllProjects={setAllProjects} />

      {/* header */}
      <Box sx={{ borderBottom: "1px solid rgb(100, 100, 100)", display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <DescriptionRoundedIcon fontSize="large" sx={{ color: "black" }} />
          <Typography fontWeight="bold" fontSize="x-large">
            CoEdit
          </Typography>
        </Box>
        <Box sx={{ minWidth: "34%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#F2F2F2",
              borderRadius: 5,
              px: 2,
              py: "5px",
            }}
          >
            <SearchRoundedIcon sx={{ color: "black" }} />
            <InputBase
              autoFocus
              id="search"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="Search (ctrl+/)"
              sx={{
                mx: 2,
                flexGrow: 1,
                fontSize: "1rem",
                bgcolor: "transparent",
                fontWeight: "bold",
              }}
            />
          </Box>
        </Box>
        <Box>
          <Tooltip title="profile"
            enterDelay={200}
            leaveDelay={0}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "common.black",
                  "& .MuiTooltip-arrow": {
                    color: "common.black",
                  },
                },
              },
            }}>
            <Avatar
              onClick={toggleProfile}
              sx={{ cursor: "pointer", width: 46, height: 46, border: "1px solid black", }}
              alt={userInfo.userName}
              src={getAvatar(userInfo.profileImage)}
              imgProps={{
                crossOrigin: "anonymous",
                referrerPolicy: "no-referrer",
                decoding: "async",
              }}
            />
          </Tooltip>
        </Box>
      </Box>

      {/* create-new-project */}
      <Box sx={{ position: "relative" }}>
        <Box sx={{ px: 20, py: 7 }}>
          <Typography fontWeight="bold" fontSize="x-large">
            Create Workspace
          </Typography>
          <button style={{ width: "200px", height: "200px" }} onClick={handleOpenDialog}>
            <AddRoundedIcon sx={{ color: "black", fontSize: 100 }} />
          </button>
        </Box>
        {isProfileVisible ? <Box ref={profileRef} sx={{ zIndex: 9999999, position: "absolute", right: 10, top: -6, bgcolor: "#FAFAFA", border: "1px solid black", borderRadius: "10px" }}>
          <User handleClose={handleCloseProfile} />
        </Box> : null}
      </Box>

      {/* list-of-projects */}
      {filteredProjects.length === 0 ? (
        <Container maxWidth="lg" sx={{ mb: 10 }}>
          <table style={{ width: "100%", height: "100%" }}>
            <thead>
              <tr>
                <th>
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Typography fontWeight="bold">
                      Admin
                    </Typography>
                  </Box>
                </th>
                <th style={{ width: "40%" }}>
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Typography fontWeight="bold">
                      Today
                    </Typography>
                  </Box>
                </th>
                <th>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography fontWeight="bold">
                      Created On
                    </Typography>
                  </Box>
                </th>
                <th>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography fontWeight="bold">
                      Last opened by me
                    </Typography>
                  </Box>
                </th>
                <th>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tooltip title={isAscending ? "Sort A-Z" : "Sort Z-A"}
                      leaveDelay={0}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "common.black",
                            color: "white",
                            transition: "none",
                          },
                        },
                      }}>
                      <IconButton onClick={sortProjectsByName}>
                        <SortByAlphaRoundedIcon sx={{ color: "black" }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </th>
              </tr>
            </thead>
          </table>
          {isFetchingProjectsLoading ? (
            Array.from({ length: 5 }, (_, index) => (
              <Skeleton
                key={index}
                animation="wave"
                variant="rounded"
                height={60}
                sx={{ width: "100%", my: 1, bgcolor: "#E6E6E6" }}
              />
            ))
          ) : (
            <Typography fontWeight="bold" fontSize="large" sx={{ m: 4, textAlign: "center" }}>
              No projects found!
            </Typography>
          )}
        </Container>
      ) : (
        <Container maxWidth="lg" sx={{ mb: 10 }}>
          <table style={{ width: "100%", height: "100%" }}>
            <thead>
              <tr>
                <th>
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Typography fontWeight="bold">
                      Admin
                    </Typography>
                  </Box>
                </th>
                <th style={{ width: "40%" }}>
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Typography fontWeight="bold">
                      Today
                    </Typography>
                  </Box>
                </th>
                <th>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography fontWeight="bold">
                      Created On
                    </Typography>
                  </Box>
                </th>
                <th>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography fontWeight="bold">
                      Last opened by me
                    </Typography>
                  </Box>
                </th>
                <th>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tooltip title={isAscending ? "Sort A-Z" : "Sort Z-A"}
                      leaveDelay={0}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "common.black",
                            color: "white",
                            transition: "none",
                          },
                        },
                      }}>
                      <IconButton onClick={sortProjectsByName}>
                        <SortByAlphaRoundedIcon sx={{ color: "black" }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects?.map((project, index) => (
                <tr key={index} onClick={() => { navigate(`/project/${project.project_id}`) }}>
                  <td>
                    <Box sx={{ position: "relative", display: "flex", justifyContent: "flex-start" }}>
                      <Tooltip
                        leaveDelay={0}
                        TransitionComponent={Zoom}
                        title={project.project_created_by}
                        placement="left"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: "common.black",
                              color: "white",
                              transition: "none",
                            },
                          },
                        }}
                      >
                        <Avatar
                          src={getAvatar(project.image)}
                          sx={{ width: 46, height: 46, border: "1px solid black" }}
                          alt="admin-image"
                          imgProps={{
                            crossOrigin: "anonymous",
                            referrerPolicy: "no-referrer",
                            decoding: "async",
                          }}
                        />
                      </Tooltip>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ position: "relative", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                      {userInfo.userName === project.project_created_by && isProjectNameEditMode === project.project_id ?
                        <input
                          ref={editMode}
                          type="text"
                          name="project_name"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          style={{
                            border: '1px solid #ccc',       // Add border color
                            borderRadius: '4px',             // Smooth border radius
                            padding: '4px',                  // Add padding for better spacing
                            fontWeight: 'bold',              // Make text bold
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent click event from propagating
                          onFocus={(e) => e.stopPropagation()} // Prevent focus event from propagating
                        />
                        :
                        <Typography fontWeight="bold">
                          {project.project_name}
                        </Typography>}
                      {userInfo.userName === project.project_created_by ?
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mx: 1 }}>
                          {isProjectNameEditMode === project.project_id ?
                            <>
                              <Tooltip title="save"
                                enterDelay={200}
                                leaveDelay={0}
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      bgcolor: "common.black",
                                      "& .MuiTooltip-arrow": {
                                        color: "common.black",
                                      },
                                    },
                                  },
                                }}>
                                <IconButton size="small" onClick={(e) => handleSaveProjectName(e, project.project_id)} sx={{ bgcolor: "#F2F2F2", mx: 1 }}>
                                  {isLoadingSaveProjectName ?
                                    <CircularProgress
                                      size={20}
                                      thickness={6}
                                      sx={{
                                        color: "black",
                                        '& circle': { strokeLinecap: 'round' },
                                      }}
                                    />
                                    :
                                    <SaveRoundedIcon fontSize="small" sx={{ color: "black" }} />
                                  }
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="cancel"
                                enterDelay={200}
                                leaveDelay={0}
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      bgcolor: "common.black",
                                      "& .MuiTooltip-arrow": {
                                        color: "common.black",
                                      },
                                    },
                                  },
                                }}>
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); setIsProjectNameEditMode(""); }} sx={{ bgcolor: "#F2F2F2", mr: 1 }}>
                                  <CloseRoundedIcon fontSize="small" sx={{ color: "black" }} />
                                </IconButton>
                              </Tooltip>
                            </>
                            :
                            <Tooltip title="edit"
                              enterDelay={200}
                              leaveDelay={0}
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    bgcolor: "common.black",
                                    "& .MuiTooltip-arrow": {
                                      color: "common.black",
                                    },
                                  },
                                },
                              }}>
                              <IconButton size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNewProjectName(project.project_name);
                                  setIsProjectNameEditMode(project.project_id);
                                }}
                                sx={{ bgcolor: "#F2F2F2", mx: 1 }}>
                                <EditRoundedIcon fontSize="small" sx={{ color: "black" }} />
                              </IconButton>
                            </Tooltip>
                          }
                          <Typography fontWeight="bold" fontSize="small" sx={{ mx: 1, px: 1, alignContent: "center", border: "1px solid #ff9500", color: "#ff9500", borderRadius: "8px" }}>
                            YOU
                          </Typography>
                        </Box>
                        : null}
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
                      <Typography>
                        {formatTimestamp(project.project_timestamp)}
                      </Typography>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
                      <Typography>
                        {formatTimestamp(project.last_opened)}
                      </Typography>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
                      <Tooltip title="delete"
                        leaveDelay={0}
                        enterDelay={0}
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: "common.black",
                              color: "white",
                              transition: "none",
                            },
                          },
                        }}>
                        <IconButton aria-label="delete" onClick={(e) => e.stopPropagation()}>
                          <DeleteOutlineRoundedIcon sx={{ color: "#333333" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container >)
      }
    </>
  );
}

export default ProjectPage;
