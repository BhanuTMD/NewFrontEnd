import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "Components/auth/AuthContext";

function NavBar() {
  // ✅ isScientist now pulled from context
  const { isAuthenticated, logout, isLoading, isAdmin, isScientist } = useAuth();
  const navigate = useNavigate();

  const [isManageOpen,     setIsManageOpen]     = useState(false);
  const [isBrowseOpen,     setIsBrowseOpen]     = useState(false);
  const [isAdminOpen,      setIsAdminOpen]      = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const manageRef = useRef(null);
  const browseRef = useRef(null);
  const adminRef  = useRef(null);

  const [name, setName] = useState("");

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) setName(userName);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (manageRef.current && !manageRef.current.contains(e.target)) setIsManageOpen(false);
      if (browseRef.current && !browseRef.current.contains(e.target))  setIsBrowseOpen(false);
      if (adminRef.current  && !adminRef.current.contains(e.target))   setIsAdminOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setIsManageOpen(false);
    setIsBrowseOpen(false);
    setIsAdminOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setName("");
    navigate("/Login");
  };

  if (isLoading) return null;

  const dropItem = "block px-4 py-2.5 hover:bg-indigo-50 text-sm text-slate-800 transition-colors";

  // ── Shared: which dropdown label to show for the admin/scientist menu ──
  const adminMenuLabel = isAdmin ? "Admin" : "My Submissions";

  return (
    <nav className="sticky top-0 z-50 w-full shadow-[0_10px_30px_rgba(15,23,42,0.35)]">
      <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-orange-400">
        <div className="backdrop-blur-xl bg-white/10 border-b border-white/25">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:py-3">

            {/* ── Left: Logo + Desktop Menu ── */}
            <div className="flex items-center gap-6">
              <Link
                to="/welcomePage"
                className="group flex items-center gap-3 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold tracking-wide hover:bg-white/20 transition-all shadow-sm"
              >
                <span className="relative h-9 w-9 rounded-2xl bg-gradient-to-tr from-white via-sky-100 to-amber-100 text-indigo-700 flex items-center justify-center text-lg font-extrabold shadow-md">
                  <img src="./logo.jpg" alt="logo" className="h-15 w-15 rounded-2xl object-contain" />
                </span>
                <span className="hidden sm:flex flex-col leading-tight">
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-white/100">
                    <Sparkles className="h-3 w-3" />
                    Technology Database <br /> Management Portal
                  </span>
                </span>
              </Link>

              {/* ── Desktop nav ── */}
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/welcomePage"
                  className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold text-white/100 hover:bg-white/15 hover:text-white transition-colors"
                >
                  Home
                </Link>

                {isAuthenticated && (
                  <>
                    {/* Browse */}
                    <div className="relative" ref={browseRef}>
                      <button
                        type="button"
                        onClick={() => { setIsBrowseOpen(p => !p); setIsManageOpen(false); setIsAdminOpen(false); }}
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                          isBrowseOpen ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        Browse
                        <ChevronDown size={16} className={`transition-transform ${isBrowseOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isBrowseOpen && (
                        <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 overflow-hidden">
                          <Link to="/viewTechnology" className={dropItem} onClick={closeAll}>
                            Technology Catalog
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Manage */}
                    <div className="relative" ref={manageRef}>
                      <button
                        type="button"
                        onClick={() => { setIsManageOpen(p => !p); setIsBrowseOpen(false); setIsAdminOpen(false); }}
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                          isManageOpen ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        Manage
                        <ChevronDown size={16} className={`transition-transform ${isManageOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isManageOpen && (
                        <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 overflow-hidden">
                          <Link to="/SectionOne"  className={dropItem} onClick={closeAll}>Submit New Technology</Link>
                          <Link to="/PendingData" className={dropItem} onClick={closeAll}>My Submissions</Link>
                          <Link to="/ExcelUpload" className={dropItem} onClick={closeAll}>Excel Upload</Link>
                        </div>
                      )}
                    </div>

                    {/* ✅ Admin dropdown — visible to ADMIN and SCIENTIST */}
                    {(isAdmin || isScientist) && (
                      <div className="relative" ref={adminRef}>
                        <button
                          type="button"
                          onClick={() => { setIsAdminOpen(p => !p); setIsBrowseOpen(false); setIsManageOpen(false); }}
                          className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors ${
                            isAdminOpen ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/15 hover:text-white"
                          }`}
                        >
                          {adminMenuLabel}
                          <ChevronDown size={16} className={`transition-transform ${isAdminOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isAdminOpen && (
                          <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 overflow-hidden">
                            {/* ✅ Tech Management visible to both */}
                            <Link to="/admin/tech-management" className={dropItem} onClick={closeAll}>
                              Technology Management
                            </Link>
                            {/* ✅ Dashboard + User Management — ADMIN ONLY */}
                            {isAdmin && (
                              <>
                                {/* <Link to="/admin/dashboard" className={dropItem} onClick={closeAll}>Technology Dashboard</Link> */}
                                <Link to="/admin/users"     className={dropItem} onClick={closeAll}>User Management</Link>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── Right: User info (desktop) ── */}
            <div className="hidden items-center gap-3 sm:flex">
              {isAuthenticated ? (
                <>
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/15 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm border border-white/20">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                      <User className="h-3.5 w-3.5" />
                    </span>
                    <span className="hidden md:inline">Welcome,&nbsp;</span>
                    <span className="font-bold truncate max-w-[130px]">{name || "User"}</span>

                    {/* ✅ Role badge — amber for Admin, sky for Scientist */}
                    {isAdmin && (
                      <span className="ml-1 rounded-full bg-amber-400/90 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 uppercase tracking-wide">
                        Admin
                      </span>
                    )}
                    {isScientist && !isAdmin && (
                      <span className="ml-1 rounded-full bg-sky-400/90 px-1.5 py-0.5 text-[9px] font-bold text-sky-900 uppercase tracking-wide">
                        Scientist
                      </span>
                    )}
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
                  <Link to="/Login"  className="rounded-full bg-white px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-700 shadow-sm hover:bg-slate-100 transition-colors">Log In</Link>
                  <Link to="/Signup" className="rounded-full border border-white/70 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/15 transition-colors">Register</Link>
                </>
              )}
            </div>

            {/* ── Mobile menu toggle ── */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(p => !p)}
              className="flex items-center justify-center rounded-full bg-black/10 p-2 text-white hover:bg-black/20 sm:hidden border border-white/30"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* ── Mobile Menu ── */}
          {isMobileMenuOpen && (
            <div className="space-y-2 px-4 pb-4 pt-2 text-sm sm:hidden bg-black/30 backdrop-blur-xl border-t border-white/20">
              <Link to="/welcomePage" className="block rounded-xl px-3 py-2 text-white/95 hover:bg-white/10" onClick={closeAll}>
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Browse (mobile) */}
                  <div className="rounded-xl bg-white/5 p-2 border border-white/10">
                    <button type="button" onClick={() => setIsBrowseOpen(p => !p)}
                      className="flex w-full items-center justify-between px-1 py-1 text-white/90">
                      <span>Browse</span>
                      <ChevronDown size={16} className={`transition-transform ${isBrowseOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isBrowseOpen && (
                      <div className="mt-2 rounded-lg bg-white/95 text-slate-800 overflow-hidden">
                        <Link to="/viewTechnology" className="block px-4 py-2 text-sm hover:bg-indigo-50" onClick={closeAll}>
                          Technology Catalog
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Manage (mobile) */}
                  <div className="rounded-xl bg-white/5 p-2 border border-white/10">
                    <button type="button" onClick={() => setIsManageOpen(p => !p)}
                      className="flex w-full items-center justify-between px-1 py-1 text-white/90">
                      <span>Manage</span>
                      <ChevronDown size={16} className={`transition-transform ${isManageOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isManageOpen && (
                      <div className="mt-2 rounded-lg bg-white/95 text-slate-800 overflow-hidden">
                        <Link to="/SectionOne"  className="block px-4 py-2 text-sm hover:bg-indigo-50" onClick={closeAll}>Submit New Technology</Link>
                        <Link to="/PendingData" className="block px-4 py-2 text-sm hover:bg-indigo-50" onClick={closeAll}>My Submissions</Link>
                        <Link to="/ExcelUpload" className="block px-4 py-2 text-sm hover:bg-indigo-50" onClick={closeAll}>Excel Upload</Link>
                      </div>
                    )}
                  </div>

                  {/* ✅ Admin/Scientist menu (mobile) */}
                  {(isAdmin || isScientist) && (
                    <div className="rounded-xl bg-white/5 p-2 border border-white/10">
                      <button type="button" onClick={() => setIsAdminOpen(p => !p)}
                        className="flex w-full items-center justify-between px-1 py-1 text-white/90">
                        <span>{adminMenuLabel}</span>
                        <ChevronDown size={16} className={`transition-transform ${isAdminOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isAdminOpen && (
                        <div className="mt-2 rounded-lg bg-white/95 text-slate-800 overflow-hidden">
                          {/* ✅ Tech Management — both roles */}
                          <Link to="/admin/tech-management" className="block px-4 py-2 text-sm hover:bg-indigo-50" onClick={closeAll}>
                            Technology Management
                          </Link>
                          {/* ✅ Admin-only links */}
                          {isAdmin && (
                            <>
                              <Link to="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-indigo-50" onClick={closeAll}>Technology Dashboard</Link>
                              <Link to="/admin/users"     className="block px-4 py-2 text-sm hover:bg-indigo-50" onClick={closeAll}>User Management</Link>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => { handleLogout(); closeAll(); }}
                    className="mt-1 block w-full rounded-xl bg-red-500/95 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-red-600 shadow-md"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/Login"  className="block rounded-xl bg-white px-3 py-2 text-center font-semibold text-indigo-700 hover:bg-slate-100" onClick={closeAll}>Log In</Link>
                  <Link to="/Signup" className="block rounded-xl border border-white/60 px-3 py-2 text-center font-semibold text-white hover:bg-white/10" onClick={closeAll}>Register</Link>
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