import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "Components/auth/AuthContext";

function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isWelcomePage = location.pathname === "/welcomePage";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // useAuth wala logout function
    navigate("/Login");
  };

  return (
    <nav className="w-full bg-indigo-300 text-blue-600 font-semibold shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo & Links */}
        <div className="flex items-center space-x-6">
          {/* Hamburger for mobile */}
          <div className="sm:hidden">
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center space-x-6">
            <Link to="/welcomePage" className="hover:text-blue-900 text-lg font-bold">
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/techSearch" className="hover:text-blue-900 text-lg font-bold">
                  View
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="cursor-pointer hover:text-blue-900 text-lg font-bold"
                    onClick={toggleDropdown}
                  >
                    Technology
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute bg-indigo-200 mt-1 rounded shadow-md z-10">
                      <Link
                        to="/SectionOne"
                        className="block px-4 py-2 hover:bg-indigo-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Add New Technology
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side: Desktop Login/Register or Logout */}
        <div className="hidden sm:block">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-lg font-bold hover:text-blue-900"
            >
              Logout
            </button>
          ) : (
            isWelcomePage && (
              <Link
                to="/Login"
                className="text-lg font-bold hover:text-blue-900"
              >
                Login/Register
              </Link>
            )
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 transition-all duration-300">
          <Link to="/welcomePage" className="block text-lg" onClick={toggleMobileMenu}>
            Home
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/techSearch" className="block text-lg" onClick={toggleMobileMenu}>
                View
              </Link>
              <div className="relative" ref={dropdownRef}>
                <div className="cursor-pointer text-lg" onClick={toggleDropdown}>
                  Technology
                </div>
                {isDropdownOpen && (
                  <div className="bg-indigo-200 rounded shadow-md mt-1">
                    <Link
                      to="/SectionOne"
                      className="block px-4 py-2 hover:bg-indigo-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        toggleMobileMenu();
                      }}
                    >
                      Add New Technology
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile Login/Register or Logout */}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="block text-lg">
              Logout
            </button>
          ) : (
            isWelcomePage && (
              <Link
                to="/Login"
                className="block text-lg cursor-pointer"
                onClick={toggleMobileMenu}
              >
                Login/Register
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
