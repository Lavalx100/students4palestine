
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { AvatarGenerator } from './AvatarGenerator';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDarkMode(!isDarkMode);
  };

  // Check user preference for dark mode
  useEffect(() => {
    if (localStorage.theme === 'dark' || 
      (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/70 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between py-4">
        <NavLink 
          to="/" 
          className="text-xl md:text-2xl font-bold flex items-center gap-2 animate-fade-in"
        >
          <span className="text-palestine-green">Students</span>
          <span className="text-palestine-red">4</span>
          <span>Palestine</span>
        </NavLink>
        
        <div className="flex items-center gap-4">
          {/* Anonymous Avatar - always visible */}
          <div className="hidden md:flex items-center gap-2 animate-fade-in animate-delay-3">
            <AvatarGenerator size={32} />
            <span className="text-sm text-muted-foreground">Anonymous</span>
          </div>
          
          {/* Dark mode toggle */}
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full hover:bg-secondary transition-colors duration-200 animate-fade-in animate-delay-4"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full md:hidden hover:bg-secondary transition-colors duration-200 animate-fade-in animate-delay-5"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className="nav-link animate-fade-in animate-delay-1">Home</NavLink>
            <NavLink to="/forum" className="nav-link animate-fade-in animate-delay-2">Forum</NavLink>
            <NavLink to="/about" className="nav-link animate-fade-in animate-delay-3">About</NavLink>
          </nav>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden px-6 py-4 bg-background/95 backdrop-blur-lg border-t border-border animate-slide-in">
          <div className="flex flex-col space-y-4">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/forum" className="nav-link">Forum</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
            <div className="flex items-center gap-2 py-2">
              <AvatarGenerator size={24} />
              <span className="text-sm text-muted-foreground">Anonymous</span>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
