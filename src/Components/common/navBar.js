import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "Components/auth/AuthContext";

// Internal code (variables, functions) are back to your original names.
// Only the UI display text (in the JSX) is changed.

function NavBar() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  // Back to your original state names
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Back to your original ref names
  const dropdownRef = useRef(null);
  const viewDropdownRef = useRef(null);

  // Back to your original state name
  const [name, setName] = useState("");

  // Get name from localStorage
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) setName(userName);
  }, [isAuthenticated]);

  // Back to your original toggle function names
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleViewDropdown = () => setIsViewDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        viewDropdownRef.current &&
        !viewDropdownRef.current.contains(event.target)
      ) {
        setIsViewDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setName("");
    navigate("/Login"); // Navigate to Sign In page
  };

  if (isLoading) return null;

  return (
    <nav className="w-full bg-indigo-300 text-blue-600 font-semibold shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <button onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center space-x-6">
            <Link
              to="/welcomePage"
              className="hover:text-blue-900 text-lg font-bold"
            >
              Home
            </Link>

            {isAuthenticated && (
              <>
                {/* View Dropdown (only All Technologies) */}
                <div className="relative" ref={viewDropdownRef}>
                  <div
                    className="cursor-pointer hover:text-blue-900 text-lg font-bold"
                    onClick={toggleViewDropdown}
                  >
                    Browse {/* <-- UI TEXT CHANGE */}
                  </div>
                  {isViewDropdownOpen && (
                    <div className="absolute w-48 bg-indigo-200 mt-1 rounded shadow-md z-10 text-sm">
                      <Link
                        to="/viewTechnology"
                        className="block px-4 py-2 hover:bg-indigo-100"
                        onClick={() => setIsViewDropdownOpen(false)}
                      >
                        Technology Catalog {/* <-- UI TEXT CHANGE */}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Technology Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="cursor-pointer hover:text-blue-900 text-lg font-bold"
                    onClick={toggleDropdown}
                  >
                    Manage {/* <-- UI TEXT CHANGE */}
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute w-48 bg-indigo-200 mt-1 rounded shadow-md z-10 text-sm">
                      <Link
                        to="/SectionOne"
                        className="block px-4 py-2 hover:bg-indigo-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Submit New Technology {/* <-- UI TEXT CHANGE */}
                      </Link>
                      <Link
                        to="/PendingData"
                        className="block px-4 py-2 hover:bg-indigo-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Review Submissions {/* <-- UI TEXT CHANGE */}
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Section (User Info) */}
        <div className="hidden sm:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-lg font-bold text-blue-900">
                Welcome, {name}
              </span>
              <button
                onClick={handleLogout}
                className="text-lg font-bold hover:text-blue-900 ml-4"
              >
                Sign Out {/* <-- UI TEXT CHANGE */}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/Login"
                className="text-lg font-bold hover:text-blue-900"
              >
                Sign In {/* <-- UI TEXT CHANGE */}
              </Link>
              <Link
                to="/Signup"
                className="ml-4 text-lg font-bold hover:text-blue-900"
              >
                Register {/* (Or "Sign Up") */}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 transition-all duration-300">
          <Link
            to="/welcomePage"
            className="block text-lg"
            onClick={toggleMobileMenu}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              {/* View Dropdown (only All Technologies) */}
              <div className="relative" ref={viewDropdownRef}>
                <div
                  className="cursor-pointer text-lg"
                  onClick={toggleViewDropdown}
                >
                  Browse {/* <-- UI TEXT CHANGE */}
                </div>
                {isViewDropdownOpen && (
                  <div className="bg-indigo-200 rounded shadow-md mt-1">
                    <Link
                      to="/viewTechnology"
                      className="block px-4 py-2 hover:bg-indigo-100"
                      onClick={() => {
                        setIsViewDropdownOpen(false);
                        toggleMobileMenu();
                      }}
                    >
                      Technology Catalog {/* <-- UI TEXT CHANGE */}
                    </Link>
                  </div>
                )}
              </div>

              {/* Technology Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div
                  className="cursor-pointer text-lg"
                  onClick={toggleDropdown}
                >
                  Manage {/* <-- UI TEXT CHANGE */}
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
                      Submit New Technology {/* <-- UI TEXT CHANGE */}
                    </Link>
                    <Link
                      to="/PendingData"
                      className="block px-4 py-2 hover:bg-indigo-100"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        toggleMobileMenu();
                      }}
                    >
                      Review Submissions {/* <-- UI TEXT CHANGE */}
                    </Link>
                  </div>
                )}
              </div>

              <button onClick={handleLogout} className="block text-lg">
                Sign Out {/* <-- UI TEXT CHANGE */}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/Login"
                className="block text-lg"
                onClick={toggleMobileMenu}
              >
                Sign In {/* <-- UI TEXT CHANGE */}
              </Link>
              <Link
                to="/Signup"
                className="block text-lg"
                onClick={toggleMobileMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
