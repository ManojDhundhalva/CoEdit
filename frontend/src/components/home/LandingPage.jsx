import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import DataArrayRoundedIcon from '@mui/icons-material/DataArrayRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import TextsmsRoundedIcon from '@mui/icons-material/TextsmsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

function LandingPage() {

    useEffect(() => {
        // GSAP timeline for flipping and rotating the element
        const tl = gsap.timeline();

        tl.fromTo(
            '.coedit',
            { scaleY: -1, transformOrigin: 'bottom bottom' },  // Initially flipped upside down at the center
            { scaleY: 1, duration: 1, ease: 'power2.out' } // Animate to the original position
        )
            .to('.coedit', {
                rotateY: 180,  // Rotate 90 degrees on Y-axis from the middle
                duration: 1,
                ease: 'power2.inOut',
                transformOrigin: 'center center',  // Ensure it rotates from the center
            })
            .to('.coedit', {
                rotateY: 0,  // Rotate back to the original position on Y-axis
                duration: 1,
                ease: 'power2.inOut',
                transformOrigin: 'center center',  // Keep the center as the rotation point
            });
    }, []);

    useEffect(() => {
        // GSAP animation for rotating the element around the Y-axis from the middle
        gsap.fromTo(
            '.oedit',
            {
                rotateY: 360,  // Start rotated 90 degrees along Y-axis
                transformOrigin: "center center",  // Rotate from the center of the element
                transformStyle: "preserve-3d",  // Enable 3D transform for correct rendering
            },
            {
                rotateY: 0,  // Rotate back to the normal position (0 degrees)
                duration: 3,  // Duration of the rotation animation
                ease: 'elastic.out',
            }
        );
    }, []);

    useEffect(() => {
        // GSAP animation for "B" flipping and appearing in stages (25%, 50%, 75%, 100%)

        const tl = gsap.timeline();
        tl.fromTo(
            '.edit',
            {
                rotateY: 180,  // Start rotated 90 degrees along Y-axis
                y: -100  // Start below its normal position
            },
            {
                y: 0,  // Rise to the normal position
                rotateY: 180,  // Start rotated 90 degrees along Y-axis
                duration: 2,
                ease: 'elastic.inOut',
            }
        ).to('.edit', {
            rotateY: 0,  // Rotate back to the normal position (0 degrees)
            duration: 2,
            ease: 'elastic.inOut',
        });

    }, []);

    useEffect(() => {
        // GSAP animation for "B" flipping and appearing in stages (25%, 50%, 75%, 100%)
        gsap.fromTo(
            '.dit',
            {
                y: -100  // Start below its normal position
            },
            {
                y: 0,  // Rise to the normal position
                duration: 1.2,
                ease: 'bounce.out',
                // 
            }
        );
    }, []);

    useEffect(() => {
        // GSAP timeline for continuous animation
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 }); // repeat infinitely with a delay between each cycle

        tl.fromTo(
            '.it',
            {
                rotateX: 0,
                transformOrigin: "center center",  // Rotate from the center of the element
                transformStyle: "preserve-3d",  // Enable 3D transform for correct rendering
            },
            {
                rotateX: 0,
                duration: 2,  // Duration of the Y-axis rotation
                ease: 'power2.inOut',
            })
            .to('.it', {
                rotateX: 360,  // Rotate 360 degrees along the X-axis
                duration: 2,  // Duration of X-axis rotation
                ease: 'power2.inOut'
            })
            .to('.it', {
                rotateX: 540,  // Rotate further 180 degrees on the X-axis (total 360 + 180)
                duration: 1,  // Duration of this X-axis rotation
                ease: 'power2.inOut'
            })
            .to('.it', {
                rotateX: 360,  // Rotate further 180 degrees on the X-axis (total 360 + 180)
                duration: 1,  // Duration of this X-axis rotation
                ease: 'power2.inOut'
            })
    }, []);


    useEffect(() => {
        // GSAP animation for "B" flipping and appearing in stages (25%, 50%, 75%, 100%)
        gsap.fromTo(
            '.t',
            {
                rotateY: 360,  // Start rotated 90 degrees along Y-axis
            },
            {
                rotateY: 0,
                duration: 2,
            }
        );
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
                return <DataObjectRoundedIcon sx={{ fontSize: "2em", color: "#012a4a" }} />;
            case 1:
                return <i className="fa-solid fa-code" style={{ fontSize: "1.5em", color: "#012a4a" }}></i>;
            case 2:
                return <DataArrayRoundedIcon sx={{ fontSize: "2em", color: "#012a4a" }} />;
            case 3:
                return <FormatQuoteRoundedIcon sx={{ fontSize: "2em", color: "#012a4a" }} />
            default:
                return null;
        }
    };

    return (
        <>
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 300,
                fontWeight: "bold",
                color: "#012a4a",
                backgroundColor: "#FAFAFA",
                position: "relative",
            }}>
                <div className="coedit">C</div>
                <div className="oedit">o</div>
                <div className="edit">E</div>
                <div className="dit">d</div>
                <div className="it">i</div>
                <div className="t">t</div>
                <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "6%", left: "6%" }}>
                    {renderIcon(0)}
                </div>
                <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "8%", left: "30%" }}>
                    {renderIcon(1)}
                </div>
                <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "60%", left: "90%" }}>
                    {renderIcon(2)}
                </div>
                <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "50%", left: "3%" }}>
                    {renderIcon(3)}
                </div>
                <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "20%", left: "86%" }}>
                    <TextsmsRoundedIcon sx={{ fontSize: "2em", color: "#012a4a" }} />
                </div>
                <div className="moving-object" style={{ opacity: 0.5, position: "absolute", fontSize: "3rem", top: "80%", left: "20%" }}>
                    <CloseRoundedIcon sx={{ fontSize: "2em", color: "#012a4a" }} />
                </div>
            </div>
        </>
    )
}

export default LandingPage