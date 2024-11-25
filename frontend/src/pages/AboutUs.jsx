import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/AboutUs.css";
import { avatars } from "../utils/avatar";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { IconButton } from "@mui/material";
import HardiImg from "../images/members/hardi.jpg";
import PrathamImg from "../images/members/pratham.jpg";
import DishankImg from "../images/members/dishank.jpeg";
import MeshvImg from "../images/members/meshv.jpg";
import MaunilImg from "../images/members/maunil.png";
import ManojImg from "../images/members/manoj.jpg";
import DivyImg from "../images/members/divy.jpg";
import KishanImg from "../images/members/kishan.jpeg";
import ShravanImg from "../images/members/shravan.jpeg";

const teamMembers = [
  {
    name: "Dishank Thakkar",
    photo: DishankImg,
    github: "https://github.com/Dishank0745",
    linkedin: "https://www.linkedin.com/in/dishank-thakkar-835650279/",
  },
  {
    name: "Divykumar Tandel",
    photo: DivyImg,
    github: "https://github.com/Tandeldivya",
    linkedin: "https://www.linkedin.com/in/divyakumar-tandel/",
  },
  {
    name: "Hardi Naik",
    photo: HardiImg,
    github: "https://github.com/Hardinaik",
    linkedin: "https://www.linkedin.com/in/hardi-naik-76558b277/",
  },
  {
    name: "Kishan Pansuriya",
    photo: KishanImg,
    github: "https://github.com/202201504",
    linkedin: "https://www.linkedin.com/in/kishan-pansuriya-9b0352253/",
  },
  {
    name: "Manoj Dhundhalva",
    photo: ManojImg,
    github: "https://github.com/ManojDhundhalva",
    linkedin: "https://www.linkedin.com/in/manoj-dhundhalva-62ba0b24b/",
  },
  {
    name: "Maunil Modi",
    photo: MaunilImg,
    github: "https://github.com/MaunilModi98",
    linkedin: "https://www.linkedin.com/in/maunilmodi/",
  },
  {
    name: "Meshv Patel",
    photo: MeshvImg,
    github: "https://github.com/Meshv12",
    linkedin: "https://www.linkedin.com/in/meshv-patel-717056253/",
  },
  {
    name: "Pratham Patel",
    photo: PrathamImg,
    github: "https://github.com/PrathamPatel25",
    linkedin: "https://www.linkedin.com/in/pratham-patel-0920-/",
  },
  {
    name: "Shravankumar Makwana",
    photo: ShravanImg,
    github: "https://github.com/Hepatitous",
    linkedin: "https://www.linkedin.com/in/shravan-makwana-7b078633a/",
  },
];


function AboutUS() {
  const [shuffledMembers, setShuffledMembers] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });

    // Shuffle the team members
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    setShuffledMembers(shuffleArray(teamMembers));
  }, []);

  return (
    <div data-aos="fade-up">
      <section className="section services-section" id="services">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-title">
                <h2 style={{ fontFamily: "Quicksand" }}>About US</h2>
                <p style={{ fontFamily: "Quicksand" }}>
                  We developed powerful real-time collaborative editing tools designed to make online teamwork seamless and efficient.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {shuffledMembers.map((member, index) => (
              <div key={index} className="col-sm-6 col-lg-6">
                <div className="feature-box-1" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px" }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <img src={member.photo} alt="logo"
                      style={{
                        border: "1px solid #333333",
                        objectFit: "cover", height: 200, width: 200,
                        backgroundColor: "#FAFAFA", borderRadius: "20%"
                      }}
                      onError={(e) => (e.target.src = avatars[0])}
                    />
                    <h5 style={{ fontFamily: "Quicksand", marginTop: 20 }}>{member.name}</h5>
                    <div>
                      <IconButton sx={{ mx: "2px" }} onClick={() => window.open(member.github, "_blank")}>
                        <GitHubIcon sx={{ color: "#333333" }} />
                      </IconButton>
                      <IconButton sx={{ mx: "2px" }} onClick={() => window.open(member.linkedin, "_blank")}>
                        <LinkedInIcon sx={{ color: "#333333" }} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-sm-6 col-lg-12">
              <div className="feature-box-1">
                <div className="icon">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div className="feature-content">
                  <div
                    className="mt-1 mb-1 my-div"
                    style={{ fontFamily: "Quicksand" }}
                  >
                    Members
                  </div>
                  {shuffledMembers.map((member, index) => (
                    <h5 key={index} style={{ fontFamily: "Quicksand" }}>
                      {member.name}
                    </h5>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-6">
              <div className="feature-box-1">
                <div className="icon">
                  <i className="fa-brands fa-react"></i>
                </div>
                <div className="feature-content">
                  <h5 style={{ fontFamily: "Quicksand" }}>React</h5>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-6">
              <div className="feature-box-1">
                <div className="icon">
                  <i className="fa-brands fa-node"></i>
                </div>
                <div className="feature-content">
                  <h5 style={{ fontFamily: "Quicksand" }}>Node JS</h5>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-6">
              <div className="feature-box-1">
                <div className="icon">
                  <i className="fa-solid fa-database"></i>
                </div>
                <div className="feature-content">
                  <h5 style={{ fontFamily: "Quicksand" }}>PostgreSQL</h5>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-6">
              <div className="feature-box-1">
                <div className="icon">
                  <i className="fa-brands fa-node-js"></i>
                </div>
                <div className="feature-content">
                  <h5 style={{ fontFamily: "Quicksand" }}>Express</h5>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-6">
              <div className="feature-box-1">
                <div className="icon">
                  <i className="fa-brands fa-uikit"></i>
                </div>
                <div className="feature-content">
                  <h5 style={{ fontFamily: "Quicksand" }}>Material UI</h5>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-6">
              <div className="feature-box-1">
                <div className="icon">
                  <i className="fa-brands fa-bootstrap"></i>
                </div>
                <div className="feature-content">
                  <h5 style={{ fontFamily: "Quicksand" }}>Bootstrap</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUS;
