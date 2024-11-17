import React from 'react'
import "../CSS/AboutUs.css"

function AboutUs() {
  return (
  <div class="box">
    <div class="navbar">
      <div class="home"></div>
    </div>
    <div class="upper">
      <div class="title-container">
        <p class="subtitle">Presenting</p>
        <h1 class="title">ABOUT US</h1>
      </div>
    </div>

    <div class="tab-container">
      <button class="tab" id="techUsedBtn">Tech Used</button>
      <button class="tab" id="aboutUsBtn">Our Team</button>
    </div>

    
    <div class="card-container" id="team">
      
      <div class="card" style="background-image: url('I.jpg');">
        <div class="card-info">
          <h5 class="name">Manoj Dhundhalva</h5>
          <h5 class="id">202201503</h5>
        </div>
      </div>

     
      <div class="card" style="background-image: url('I.jpg');">
        <div class="card-info">
          <h5 class="name">Pratham Patel</h5>
          <h5 class="id">202201485</h5>
        </div>
      </div>

      
      <div class="card" style="background-image: url('I.png');">
        <div class="card-info">
          <h5 class="name">Meshv Patel</h5>
          <h5 class="id">202201479</h5>
        </div>
      </div>

      <div class="card" style="background-image: url('I.jpg');">
        <div class="card-info">
          <h5 class="name">Dishank Thakkar</h5>
          <h5 class="id">202201518</h5>
        </div>
      </div>

      <div class="card" style="background-image: url('I.png');">
        <div class="card-info">
          <h5 class="name">Maunil Modi</h5>
          <h5 class="id">202201490</h5>
        </div>
      </div>

      <div class="card" style="background-image: url('I.png');">
        <div class="card-info">
          <h5 class="name">Shravan Makwana</h5>
          <h5 class="id">202201492</h5>
        </div>
      </div>

      <div class="card" style="background-image: url('I.png');">
        <div class="card-info">
          <h5 class="name">Divya Tandel</h5>
          <h5 class="id">202201469</h5>
        </div>
      </div>

      <div class="card" style="background-image: url('I.png');">
        <div class="card-info">
          <h5 class="name">Kisan Pansuriya</h5>
          <h5 class="id">202201504</h5>
        </div>
      </div>

      <div class="card" style="background-image: url('hardi.jpg');">
        <div class="card-info">
          <h5 class="name">Hardi Naik</h5>
          <h5 class="id">202201477</h5>
        </div>
      </div>
    </div>

    


 
    </div>
  )
}

export default AboutUs

