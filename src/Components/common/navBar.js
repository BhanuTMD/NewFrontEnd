import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "Components/auth/AuthContext";

function NavBar() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const viewDropdownRef = useRef(null);

  const [name, setName] = useState("");

  // Get name from localStorage
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) setName(userName);
  }, [isAuthenticated]);

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
    navigate("/Login");
  };

  if (isLoading) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 text-white shadow-md">
      {/* Glass effect background */}
      <div className="backdrop-blur-sm bg-black/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Left Section: Logo + Desktop Menu */}
          <div className="flex items-center gap-6">
            {/* Brand / Logo */}
            <Link
              to="/welcomePage"
              className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold tracking-wide hover:bg-white/20"
            >
              <span className="h-8 w-8 rounded-full bg-white/80 text-indigo-700 flex items-center justify-center text-lg font-extrabold shadow-sm">
                T
              </span>
              <span className="hidden sm:flex flex-col leading-tight">
                <span className="text-xs uppercase tracking-widest text-white/80">
                  Technology Portal
                </span>
                <span className="text-sm font-bold">CSIR Tech Catalog</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden items-center gap-4 sm:flex">
              <Link
                to="/welcomePage"
                className="rounded-full px-3 py-1 text-sm font-semibold hover:bg-white/15 transition-colors"
              >
                Home
              </Link>

              {isAuthenticated && (
                <>
                  {/* View Dropdown */}
                  <div className="relative" ref={viewDropdownRef}>
                    <button
                      type="button"
                      onClick={toggleViewDropdown}
                      className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold hover:bg-white/15 transition-colors"
                    >
                      Browse
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          isViewDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isViewDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white/95 text-sm text-slate-800 shadow-lg ring-1 ring-black/5">
                        <Link
                          to="/viewTechnology"
                          className="block rounded-t-xl px-4 py-2 hover:bg-indigo-50"
                          onClick={() => setIsViewDropdownOpen(false)}
                        >
                          Technology Catalog
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Manage Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold hover:bg-white/15 transition-colors"
                    >
                      Manage
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-60 rounded-xl bg-white/95 text-sm text-slate-800 shadow-lg ring-1 ring-black/5">
                        <Link
                          to="/SectionOne"
                          className="block px-4 py-2 hover:bg-indigo-50"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Submit New Technology
                        </Link>
                        <Link
                          to="/PendingData"
                          className="block rounded-b-xl px-4 py-2 hover:bg-indigo-50"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Review Submissions
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Section: User Info (Desktop) */}
          <div className="hidden items-center gap-4 sm:flex">
            {isAuthenticated ? (
              <>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white shadow-sm">
                  Welcome,{" "}
                  <span className="font-bold">
                    {name || "User"}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-white/40 px-4 py-1 text-sm font-semibold hover:bg-white/15 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/Signup"
                  className="rounded-full border border-white/60 px-4 py-1 text-sm font-semibold hover:bg-white/15 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="flex items-center justify-center rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:hidden"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="space-y-2 px-4 pb-4 pt-2 text-sm sm:hidden bg-black/10 backdrop-blur-sm border-t border-white/20">
            <Link
              to="/welcomePage"
              className="block rounded-lg px-3 py-2 hover:bg-white/10"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {/* Browse (mobile) */}
                <div className="rounded-lg bg-white/5 p-2">
                  <button
                    type="button"
                    onClick={toggleViewDropdown}
                    className="flex w-full items-center justify-between px-1 py-1"
                  >
                    <span>Browse</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isViewDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isViewDropdownOpen && (
                    <div className="mt-1 rounded-md bg-white/90 text-slate-800 shadow-md">
                      <Link
                        to="/viewTechnology"
                        className="block px-4 py-2 text-sm hover:bg-indigo-50"
                        onClick={() => {
                          setIsViewDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Technology Catalog
                      </Link>
                    </div>
                  )}
                </div>

                {/* Manage (mobile) */}
                <div className="rounded-lg bg-white/5 p-2">
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="flex w-full items-center justify-between px-1 py-1"
                  >
                    <span>Manage</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="mt-1 rounded-md bg-white/90 text-slate-800 shadow-md">
                      <Link
                        to="/SectionOne"
                        className="block px-4 py-2 text-sm hover:bg-indigo-50"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Submit New Technology
                      </Link>
                      <Link
                        to="/PendingData"
                        className="block px-4 py-2 text-sm hover:bg-indigo-50"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Review Submissions
                      </Link>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-1 block w-full rounded-lg bg-red-500/90 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  className="block rounded-lg bg-white px-3 py-2 text-center font-semibold text-indigo-700 hover:bg-slate-100"
                  onClick={toggleMobileMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/Signup"
                  className="block rounded-lg border border-white/60 px-3 py-2 text-center font-semibold text-white hover:bg-white/10"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
