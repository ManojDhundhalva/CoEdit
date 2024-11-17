import React from 'react'

function HomePage() {
  return (<>
    <div class="box">
      

      <div class="row">
        <div class="col">
          <h1 id="heading">
            <span class="auto-type"></span>
          </h1>
        </div>
        <div class="col">
          {/* <img src="images/pic1.png" class="feature-image" alt="Feature" />  */}
           <img src = "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" class = "feature-image" alt = "Feature" />
        </div>
      </div>
    </div>

    <div class="card_part">
      <div class="part_2">
        <div class="col">
          <p>
            Your ideas are ready to take shape—click 'Edit' and make them come
            alive!
          </p>
        </div>
        <div class="col">
          <div class="video-container_1">
            <video id="my-video_1" autoplay loop muted>
              <source src="video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
  
      <div class="part_3">
        <div class="col">
          <div class="video-container_2">
            <video id="my-video_2" autoplay loop muted>
              <source src="video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div class="col">
          <p>
            A Space Where Creativity Meets Collaboration in Real Time.
          </p>
        </div>
      </div>
  
    </div>
    <div class="space"></div>
    </>
   
  )
}

export default HomePage
