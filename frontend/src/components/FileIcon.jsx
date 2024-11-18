import React from 'react';
import { fileIcons } from "../utils/file-icon"

const FileIcon = ({ fileName }) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const icon = fileIcons[extension] || <i className="fas fa-file"></i>; // Default icon if no match

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>{icon}</span>
            <span>{fileName}</span>
        </div>
    );
};

export default FileIcon;
