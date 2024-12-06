import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Box } from "@mui/material";
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import DataArrayRoundedIcon from '@mui/icons-material/DataArrayRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


gsap.registerPlugin(ScrollTrigger);

const objectives = [
    { key: "Real-time Collaboration", value: "Enables multiple users to edit and view changes together in real time" },
    { key: "Instant Updates", value: "Synchronizes changes instantly across all connected devices" },
    { key: "Chat Functionality", value: "Facilitates in-editor communication for seamless collaboration" },
    { key: "Code Runner", value: "Allows writing, running, and testing code directly within the editor" },
    { key: "File Explorer", value: "Provides an intuitive interface to manage and navigate project files" },
    { key: "Text Editor", value: "Supports customizable themes and auto complete" },
    { key: "Change Logs", value: "Tracks and records all file changes with username, line, and character details" },
    { key: "Export Project", value: "Allows users to export the project files for external use or sharing" }
];


const HorizontalScroll = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;

        gsap.to(content, {
            x: () => -(content.scrollWidth - container.offsetWidth),
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: () => `+=${content.scrollWidth - container.offsetWidth}`,
                scrub: 1,
                pin: true,
                invalidateOnRefresh: true,
            },
        });

        return () => {
            ScrollTrigger.killAll();
        };
    }, []);

    useEffect(() => {
        // Function to handle mouse movement
        const handleMouseMove = (event) => {
            const elements = document.querySelectorAll(".moving-object");
            elements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const offsetX = (event.clientX - (rect.left + rect.width / 2)) / 50; // Minor horizontal movement
                const offsetY = (event.clientY - (rect.top + rect.height / 2)) / 50; // Minor vertical movement

                // Apply GSAP animation for smooth movement
                gsap.to(element, {
                    x: offsetX,
                    y: offsetY,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });
        };

        // Attach the mousemove event listener
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            // Cleanup the event listener on unmount
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const renderIcon = (iconIndex) => {
        switch (iconIndex) {
            case 0:
                return <DataObjectRoundedIcon sx={{ fontSize: "1em", color: "#012a4a" }} />;
            case 1:
                return <i className="fa-solid fa-code" style={{ fontSize: "1em", color: "#012a4a" }}></i>;
            case 2:
                return <DataArrayRoundedIcon sx={{ fontSize: "1em", color: "#012a4a" }} />;
            case 3:
                return <FormatQuoteRoundedIcon sx={{ fontSize: "1em", color: "#012a4a" }} />
            default:
                return null;
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                overflow: "hidden",
                position: "relative",
                width: "100vw",
                height: "100vh",
            }}
        >
            <div
                ref={contentRef}
                style={{
                    display: "flex",
                    whiteSpace: "nowrap",
                }}
            >
                {Array.from({ length: objectives.length }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            flex: "0 0 auto",
                            width: "100vw",
                            height: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "white",
                            position: "relative",
                        }}
                    >

                        <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "6%", left: "6%" }}>
                            {renderIcon(0)}
                        </div>
                        <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "8%", left: "30%" }}>
                            {renderIcon(1)}
                        </div>
                        <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "80%", left: "90%" }}>
                            {renderIcon(2)}
                        </div>
                        <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "28%", left: "70%" }}>
                            {renderIcon(3)}
                        </div>
                        <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "80%", left: "20%" }}>
                            <CloseRoundedIcon sx={{ color: "#012a4a", fontSize: "1em", }} />
                        </div>
                        <div
                            style={{
                                maxWidth: "80%",
                                fontSize: "3.5rem",
                                fontWeight: "bold",
                                whiteSpace: "pre-wrap", // Allows multiline wrapping
                                wordWrap: "break-word", // Ensures long words break if necessary
                            }}
                        >
                            <Box sx={{
                                color: "white", background: "#012a4a",
                                width: "fit-content",
                                px: 10,
                                py: 2,
                                borderRadius: 5,
                            }}>
                                {objectives[index].key}
                            </Box>
                            <Box sx={{ m: 1 }}>
                                {objectives[index].value}
                            </Box>

                        </div>

                    </div>
                ))}
            </div>
        </div >
    );
};

export default HorizontalScroll;
