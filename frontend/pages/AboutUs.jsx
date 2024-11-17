import React, { useState } from "react";
import "../CSS/Final.css"; // Ensure your CSS file matches the styles in your original project

function AboutUs() {
  // State to manage active section ('team' or 'tech')
  const [activeSection, setActiveSection] = useState("team");

  // Functions to toggle sections
  const showTechSection = () => {
    setActiveSection("tech");
  };

  const showTeamSection = () => {
    setActiveSection("team");
  };

  return (
    <div className="box">

      {/* Title Section */}
      <div className="upper">
        <div className="title-container">
          <p className="subtitle">Presenting</p>
          <h1 className="title">ABOUT US</h1>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="tab-container">
        <button className="tab" onClick={showTechSection}>
          Tech Used
        </button>
        <button className="tab" onClick={showTeamSection}>
          Our Team
        </button>
      </div>

      {/* Conditional Rendering for Sections */}
      {activeSection === "team" && (
        <div className="card-container" id="team">

          {/* Team Section */}
          <div className="card" style={{ backgroundImage: "url('I.jpg')" }}>
            <div className="card-info">
              <h5 className="name">Manoj Dhundhalva</h5>
              <h5 className="id">202201503</h5>
            </div>
          </div>
          <div className="card" style={{ backgroundImage: "url('I.jpg')" }}>
            <div className="card-info">
              <h5 className="name">Pratham Patel</h5>
              <h5 className="id">202201485</h5>
            </div>
          </div>
          <div className="card" style={{ backgroundImage: "url('I.png')" }}>
            <div className="card-info">
              <h5 className="name">Meshv Patel</h5>
              <h5 className="id">202201479</h5>
            </div>
          </div>
          <div className="card" style={{ backgroundImage: "url('I.jpg')" }}>
            <div className="card-info">
              <h5 class="name">Dishank Thakkar</h5>
          <h5 class="id">202201518</h5>
            </div>
          </div>
          <div className="card" style={{ backgroundImage: "url('I.jpg')" }}>
            <div className="card-info">
                <h5 class="name">Maunil Modi</h5>
                <h5 class="id">202201490</h5>
            </div>
          </div>
          <div className="card" style={{ backgroundImage: "url('I.png')" }}>
            <div className="card-info">
                <h5 class="name">Shravan Makwana</h5>
                <h5 class="id">202201492</h5>
            </div>
          </div>
          <div className="card" style={{ backgroundImage: "url('I.jpg')" }}>
            <div className="card-info">
                <h5 class="name">Divya Tandel</h5>
                <h5 class="id">202201469</h5>
            </div>
          </div>
          <div className="card" style={{ backgroundImage: "url('I.jpg')" }}>
            <div className="card-info">
                <h5 class="name">Kisan Pansuriya</h5>
                <h5 class="id">202201504</h5>
            </div>
          </div>
          <div className="card" style={{ backgroundImage: "url('I.png')" }}>
            <div className="card-info">
                <h5 class="name">Hardi Naik</h5>
                <h5 class="id">202201477</h5>
            </div>
          </div>
          {/* Add the remaining team members similarly */}
        </div>
      )}

      {activeSection === "tech" && (
        <div className="tech" id="tech">
          {/* Tech Used Section */}
          <div className="tech-card">
            <div className="logo react-logo"></div>
            <p>React</p>
          </div>
          <div className="tech-card">
            <div className="logo nodejs-logo"></div>
            <p>Node.js</p>
          </div>
          <div className="tech-card">
            <div className="logo express-logo"></div>
            <p>Express</p>
          </div>
          <div className="tech-card">
            <div className="logo postgresql-logo"></div>
            <p>PostgreSQL</p>
          </div>
          <div className="tech-card">
            <div className="logo materialui-logo"></div>
            <p>Material UI</p>
          </div>
          <div className="tech-card">
            <div className="logo bootstrap-logo"></div>
            <p>Bootstrap</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AboutUs;