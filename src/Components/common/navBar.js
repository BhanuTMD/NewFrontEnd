import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, Sparkles } from "lucide-react";
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
    <nav className="sticky top-0 z-50 w-full shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
      {/* Gradient strip behind glass navbar */}
      <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-orange-400">
        {/* Glass shell */}
        <div className="backdrop-blur-xl bg-white/10 border-b border-white/25">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:py-3">
            {/* Left Section: Logo + Desktop Menu */}
            <div className="flex items-center gap-6">
              {/* Brand / Logo */}
              <Link
                to="/welcomePage"
                className="group flex items-center gap-3 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold tracking-wide hover:bg-white/20 transition-all shadow-sm"
              >
                <span className="relative h-9 w-9 rounded-2xl bg-gradient-to-tr from-white via-sky-100 to-amber-100 text-indigo-700 flex items-center justify-center text-lg font-extrabold shadow-md">
                  <span className="absolute inset-0 rounded-2xl border border-white/70/0" />
                  T
                </span>
                <span className="hidden sm:flex flex-col leading-tight">
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-white/80">
                    <Sparkles className="h-3 w-3" />
                    Technology Portal
                  </span>
                  <span className="text-sm font-bold text-white">
                    CSIR Tech Catalog
                  </span>
                </span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/welcomePage"
                  className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold text-white/90 hover:bg-white/15 hover:text-white transition-colors"
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
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                          isViewDropdownOpen
                            ? "bg-white/20 text-white"
                            : "text-white/90 hover:bg-white/15 hover:text-white"
                        }`}
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
                        <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white/95 text-sm text-slate-800 shadow-xl ring-1 ring-black/5 overflow-hidden">
                          <Link
                            to="/viewTechnology"
                            className="block px-4 py-2.5 hover:bg-indigo-50 text-sm"
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
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                          isDropdownOpen
                            ? "bg-white/20 text-white"
                            : "text-white/90 hover:bg-white/15 hover:text-white"
                        }`}
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
                        <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-white/95 text-sm text-slate-800 shadow-xl ring-1 ring-black/5 overflow-hidden">
                          <Link
                            to="/SectionOne"
                            className="block px-4 py-2.5 hover:bg-indigo-50 text-sm"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            Submit New Technology
                          </Link>
                          <Link
                            to="/PendingData"
                            className="block px-4 py-2.5 hover:bg-indigo-50 text-sm"
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
            <div className="hidden items-center gap-3 sm:flex">
              {isAuthenticated ? (
                <>
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/15 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm border border-white/20">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      <User className="h-3.5 w-3.5" />
                    </span>
                    <span className="hidden md:inline">Welcome,&nbsp;</span>
                    <span className="font-bold truncate max-w-[130px]">
                      {name || "User"}
                    </span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/40 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white/95 hover:bg-white/15 transition-colors shadow-sm"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/Login"
                    className="rounded-full bg-white px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 shadow-sm hover:bg-slate-100 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/Signup"
                    className="rounded-full border border-white/70 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/15 transition-colors"
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
              className="flex items-center justify-center rounded-full bg-black/10 p-2 text-white hover:bg-black/20 sm:hidden border border-white/30"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="space-y-2 px-4 pb-4 pt-2 text-sm sm:hidden bg-black/30 backdrop-blur-xl border-t border-white/20">
              <Link
                to="/welcomePage"
                className="block rounded-xl px-3 py-2 text-white/95 hover:bg-white/10"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Browse (mobile) */}
                  <div className="rounded-xl bg-white/5 p-2 border border-white/10">
                    <button
                      type="button"
                      onClick={toggleViewDropdown}
                      className="flex w-full items-center justify-between px-1 py-1 text-white/90"
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
                      <div className="mt-2 rounded-lg bg-white/95 text-slate-800 shadow-md overflow-hidden">
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
                  <div className="rounded-xl bg-white/5 p-2 border border-white/10">
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="flex w-full items-center justify-between px-1 py-1 text-white/90"
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
                      <div className="mt-2 rounded-lg bg-white/95 text-slate-800 shadow-md overflow-hidden">
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
                    className="mt-1 block w-full rounded-xl bg-red-500/95 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-red-600 shadow-md"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/Login"
                    className="block rounded-xl bg-white px-3 py-2 text-center font-semibold text-indigo-700 hover:bg-slate-100"
                    onClick={toggleMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/Signup"
                    className="block rounded-xl border border-white/60 px-3 py-2 text-center font-semibold text-white hover:bg-white/10"
                    onClick={toggleMobileMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
