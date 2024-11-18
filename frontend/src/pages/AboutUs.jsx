import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/AboutUs.css";

function AboutUS() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
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
                  We design and develop services for customers of all sizes,
                  specializing in creating stylish, modern websites
                </p>
              </div>
            </div>
          </div>
          <div className="row">
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
                  <h5 style={{ fontFamily: "Quicksand" }}>
                    <a
                      href="/"
                      style={{ textDecoration: "none" }}
                      target="_blank"
                    >
                      ABC
                    </a>
                  </h5>
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
