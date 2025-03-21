import React, { useState, useEffect } from "react";
import "./style.css";
import { useParams } from "react-router-dom"; // useParams is used in v6
import { homeData, recommended } from "../../dummyData";
import Upcomming from "../upcoming/Upcomming";

const SinglePage = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const [item, setItem] = useState(null); // State to store the selected movie
  const [rec, setRec] = useState(recommended); // State for recommended movies
  const [activeTab, setActiveTab] = useState("details"); // State to track the active tab
  const [expanded, setExpanded] = useState(false); // State to track if the description is expanded
  const [isPlaying, setIsPlaying] = useState(false); // State to track if video is playing
  const [videoRef, setVideoRef] = useState(null); // Reference to the video element

  useEffect(() => {
    // Find the movie in homeData based on the ID
    const selectedItem = homeData.find((item) => item.id === parseInt(id));
    if (selectedItem) {
      setItem(selectedItem); // Set the selected movie
    }
    
    // Reset video playing state when navigating between movies
    setIsPlaying(false);
  }, [id]);

  // Function to handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to toggle expanded description
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Function to handle video play/pause
  const handleVideoPlayback = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Function to handle social sharing
  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    const title = item ? `Check out ${item.name} on CineSync` : "Check this movie on CineSync";
    
    let shareLink;
    
    switch(platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&t=${encodeURIComponent(title)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        shareLink = null;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  // Function to render rating stars
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-star-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <>
      {item ? (
        <>
          <section className="singlePage" style={{
            background: `linear-gradient(to bottom, rgba(20, 20, 20, 1), rgba(20, 20, 20, 0.8)), url(${item.cover}) no-repeat center/cover fixed`
          }}>
            <div className="singleHeading">
              <h1>{item.name}</h1> <span> | {item.time} | </span> <span> HD </span>
            </div>
            <div className="container">
              {/* Enhanced Video Player with Poster Overlay */}
              <div className="video-container">
                {!isPlaying && (
                  <div className="video-poster" onClick={handleVideoPlayback}>
                    <img src={item.cover} alt={`${item.name} poster`} />
                    <div className="play-button-wrapper">
                      <div className="play-button">
                        <i className="fas fa-play"></i>
                      </div>
                      <span>Play Trailer</span>
                    </div>
                  </div>
                )}
                <video 
                  ref={ref => setVideoRef(ref)}
                  src={item.video} 
                  controls={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  style={{ width: "100%", display: isPlaying ? 'block' : 'none' }}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="video-controls">
                  <div className="video-info">
                    <div className="quality-badge">HD</div>
                    <div className="movie-rating">
                      <div className="star-rating">
                        {renderRatingStars(item.rating)}
                      </div>
                      <span className="rating-number">{item.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabbed Content Navigation */}
              <div className="movie-tabs">
                <div className="tab-buttons">
                  <button 
                    className={activeTab === "details" ? "active" : ""}
                    onClick={() => handleTabChange("details")}
                  >
                    Details
                  </button>
                  <button 
                    className={activeTab === "cast" ? "active" : ""}
                    onClick={() => handleTabChange("cast")}
                  >
                    Cast
                  </button>
                  <button 
                    className={activeTab === "similar" ? "active" : ""}
                    onClick={() => handleTabChange("similar")}
                  >
                    Similar Movies
                  </button>
                </div>
              
                {/* Tab Content */}
                <div className="tab-content">
                  {/* Details Tab */}
                  {activeTab === "details" && (
                    <div className="tab-pane">
                      <div className="para">
                        <h3>Date: {item.date}</h3>
                        <div className="genres-tags">
                          <p><strong>Genres:</strong> {item.genres || "Not specified"}</p>
                          <p><strong>Tags:</strong> {item.tags || "Not specified"}</p>
                        </div>
                        <div className="expandable-section">
                          <p className={expanded ? "expanded" : "collapsed"}>
                            {item.desc}
                          </p>
                          {item.desc && item.desc.length > 150 && (
                            <button className="read-more" onClick={toggleExpand}>
                              {expanded ? "Read Less" : "Read More"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Cast Tab */}
                  {activeTab === "cast" && (
                    <div className="tab-pane">
                      <div className="cast-section">
                        <h3>Starring</h3>
                        <p>{item.starring || "Cast information not available"}</p>
                        <div className="cast-members">
                          {/* We would typically map through cast members here */}
                          <div className="cast-placeholder">
                            <i className="fas fa-user-circle cast-avatar"></i>
                            <span>Cast details coming soon</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Similar Movies Tab */}
                  {activeTab === "similar" && (
                    <div className="tab-pane">
                      <h3>You might also like</h3>
                      <p>Based on your interest in {item.name}</p>
                      {/* This would be shown inline on the single page instead of below */}
                      <div className="similar-preview">
                        {rec.slice(0, 3).map((item) => (
                          <div className="similar-item" key={item.id}>
                            <img src={item.cover} alt={item.name} />
                            <div className="similar-info">
                              <h4>{item.name}</h4>
                              <span>{item.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Sharing Icons - Now functional */}
              <div className="soical">
                <h3>Share:</h3>
                <img 
                  src="https://img.icons8.com/color/48/000000/facebook-new.png" 
                  alt="Facebook" 
                  onClick={() => handleShare('facebook')}
                  style={{ cursor: 'pointer' }}
                />
                <img 
                  src="https://img.icons8.com/fluency/48/000000/twitter-circled.png" 
                  alt="Twitter" 
                  onClick={() => handleShare('twitter')}
                  style={{ cursor: 'pointer' }}
                />
                <img 
                  src="https://img.icons8.com/fluency/48/000000/linkedin-circled.png" 
                  alt="LinkedIn" 
                  onClick={() => handleShare('linkedin')}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          </section>

          {/* Recommended Movies Section */}
          <Upcomming items={rec} title="Recommended Movies" />
        </>
      ) : (
        <p>No movie found.</p> // Fallback if no movie is found
      )}
    </>
  );
};

export default SinglePage;



