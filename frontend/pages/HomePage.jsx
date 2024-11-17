import React, { useEffect } from "react";
import Typed from "typed.js";
import "../CSS/HomePage.css"
function App() {
  useEffect(() => {
    const typed = new Typed(".auto-type", {
      strings: [
        "Collaborate Instantly, Write Effortlessly!!!...",
        "A platform built for a new way of working",
        "Edit, share, and create in real-time with your team—anytime, anywhere.",
      ],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true,
    });

    // Cleanup function to destroy the Typed instance
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div>
      {/* Main Content */}
      <div className="box">
        <div className="row">
          <div className="col">
            <h1 id="heading">
              <span className="auto-type"></span>
            </h1>
          </div>
          <div className="col">
            <img
              src="https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              className="feature-image"
              alt="Feature"
            />
          </div>
        </div>
      </div>

      {/* Video and Content Section */}
      <div className="card_part">
        <div className="part_2">
          <div className="col">
            <p>
              Your ideas are ready to take shape—click 'Edit' and make them come
              alive!
            </p>
          </div>
          <div className="col">
            <div className="video-container_1">
              <video id="my-video_1" autoPlay loop muted>
                <source src="video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>

        <div className="part_3">
          <div className="col">
            <div className="video-container_2">
              <video id="my-video_2" autoPlay loop muted>
                <source src="video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="col">
            <p>A Space Where Creativity Meets Collaboration in Real Time.</p>
          </div>
        </div>
      </div>

      <div className="space"></div>
    </div>
  );
}

export default App;