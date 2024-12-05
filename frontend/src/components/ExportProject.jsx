import React, { useState } from 'react';
import { toast } from "react-hot-toast";

// Utils
import API from '../utils/api';

// Material UI Components
import { Tooltip, CircularProgress } from '@mui/material';

// Material UI Icons
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

export default function ExportProject(props) {

    const { projectId, projectName } = props;
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/project/export-project?project_id=${projectId}`, {
                responseType: 'blob', // Important to handle the zip file
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${projectName}.zip`);
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up after download
            document.body.removeChild(link);  // Remove the link from the DOM
            window.URL.revokeObjectURL(url);  // Release the object URL to free up memory
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
            setIsLoading(false);
        }
    };

    return (
        <Tooltip
            title="Export Project"
            leaveDelay={0}
            enterDelay={0}
            componentsProps={{
                tooltip: {
                    sx: {
                        border: "1px solid black",
                        bgcolor: "white",
                        color: "black",
                        transition: "none",
                        fontWeight: "bold",
                    },
                },
                arrow: {
                    sx: {
                        color: "black",
                    },
                },
            }}
        >
            <button onClick={handleDownload}>
                {isLoading ?
                    <CircularProgress
                        size={24}
                        thickness={6}
                        sx={{
                            color: "black",
                            '& circle': { strokeLinecap: 'round' },
                        }}
                    />
                    :
                    <FileDownloadOutlinedIcon />
                }
            </button>
        </Tooltip>
    )
};