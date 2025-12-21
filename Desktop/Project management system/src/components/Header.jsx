import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Rocket } from 'lucide-react';
import '../styles/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <Rocket className="logo-icon" size={24} />
          <span className="logo-text">Nebula</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="btn btn-text">Log in</Link>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
          
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`}>
        <nav className="nav-mobile">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/features" onClick={() => setIsMenuOpen(false)}>Features</Link>
          <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
          <div className="mobile-actions">
            <Link to="/login" className="btn btn-secondary full-width" onClick={() => setIsMenuOpen(false)}>Log in</Link>
            <Link to="/signup" className="btn btn-primary full-width" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
