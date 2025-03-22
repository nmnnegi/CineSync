import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import "./header.css"

const Header = () => {
  const [mobile, setMobile] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Handle search input
  const handleSearchToggle = () => {
    setSearchExpanded(!searchExpanded)
    if (searchExpanded) {
      // If we're closing, reset the query
      setSearchQuery("")
    }
  }
  
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // In a real app, we would handle search here
    console.log("Searching for:", searchQuery)
    setSearchExpanded(false)
    setSearchQuery("")
  }
  
  // Check if a link is active
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobile && !e.target.closest('.navMenu-list') && !e.target.closest('.toggle')) {
        setMobile(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [mobile])
  
  return (
    <>
      <header className={scrolled ? "scrolled" : ""}>
        <div className='container flexSB'>
          <nav className='flexSB'>
            <div className='logo'>
              <img src='/images/logo.png' alt='CineSync Logo' />
            </div>
            
            <ul className={mobile ? "navMenu-list active" : "flexSB"} onClick={() => setMobile(false)}>
              <li className={isActive("/") ? "active" : ""}>
                <Link to='/'>Home</Link>
                <span className="nav-indicator"></span>
              </li>
              <li className={isActive("/series") ? "active" : ""}>
                <Link to='/series'>Series</Link>
                <span className="nav-indicator"></span>
              </li>
              <li className={isActive("/movies") ? "active" : ""}>
                <Link to='/movies'>Movies</Link>
                <span className="nav-indicator"></span>
              </li>
              <li className={isActive("/pages") ? "active" : ""}>
                <Link to='/pages'>Pages</Link>
                <span className="nav-indicator"></span>
              </li>
              <li className={isActive("/pricing") ? "active" : ""}>
                <Link to='/pricing'>Pricing</Link>
                <span className="nav-indicator"></span>
              </li>
              <li className={isActive("/contact") ? "active" : ""}>
                <Link to='/contact'>Contact</Link>
                <span className="nav-indicator"></span>
              </li>
            </ul>
            
            <button className='toggle' onClick={() => setMobile(!mobile)}>
              {mobile ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
            </button>
          </nav>
          
          <div className='account flexSB'>
            <div className={`search-container ${searchExpanded ? 'expanded' : ''}`}>
              <i className='fa fa-search' onClick={handleSearchToggle}></i>
              {searchExpanded && (
                <form onSubmit={handleSearchSubmit}>
                  <input 
                    type="text" 
                    placeholder="Search movies, series..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </form>
              )}
            </div>
            
            <div className="notification-icon">
              <i className='fas fa-bell'></i>
              <span className="notification-badge">2</span>
            </div>
            
            <div className="user-profile">
              <i className='fas fa-user'></i>
              <div className="user-dropdown">
                <div className="dropdown-item"><i className="fas fa-user-circle"></i> Profile</div>
                <div className="dropdown-item"><i className="fas fa-cog"></i> Settings</div>
                <div className="dropdown-item"><i className="fas fa-list"></i> Watchlist</div>
                <div className="dropdown-item"><i className="fas fa-sign-out-alt"></i> Logout</div>
              </div>
            </div>
            
            <button className="subscribe-btn">
              <span>Subscribe Now</span>
              <i className="fas fa-crown"></i>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
