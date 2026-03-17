import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiFileText,
  FiSearch,
  FiHome,
  FiGrid,
  FiSettings,
  FiLogOut,
  FiLogIn,
  FiGlobe,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { role, logout } = useAuth();
  const { lang, setLang, t } = useLang();

  const publicLinks = [
    { to: "/", label: t("home"), icon: FiHome },
    ...(role === null
      ? [
          { to: "/submit", label: t("submitGrievance"), icon: FiFileText },
          { to: "/track", label: t("trackStatus"), icon: FiSearch },
          { to: "/forgot-token", label: t("forgotToken"), icon: FiSearch },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* DMK stripe */}
      <div
        className="h-1"
        style={{
          background: "linear-gradient(90deg, #f3f4f6 50%, #fef3c7 50%)",
        }}
      />

      {/* Top bar */}
      <div className="bg-white text-gray-800 text-xs py-1 px-4 text-center font-medium border-b border-gray-200">
        🇮🇳 {t("officialPortal")} &nbsp;|&nbsp; {t("tollFree")}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 font-bold text-lg shadow"
              style={{
                background: "linear-gradient(135deg, #f3f4f6, #fef3c7)",
              }}
            >
                              க

            </div>
            <div>
              <p
                className="font-bold text-sm leading-tight"
                style={{ color: "#374151" }}
              >
                {t("portalName")}
              </p>
              <p className="text-gray-500 text-xs">{t("portalTagline")}</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  pathname === to
                    ? "bg-primary-light text-primary-dark"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="text-base" />
                {label}
              </Link>
            ))}

            {role === "minister" || role === "admin" ? (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  pathname === "/dashboard"
                    ? "bg-primary-light text-primary-dark"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiGrid /> {t("dashboard")}
              </Link>
            ) : null}

            {role === "admin" ? (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  pathname === "/admin"
                    ? "bg-primary-light text-primary-dark"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiSettings /> {t("admin")}
              </Link>
            ) : null}

            {/* Lang toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "ta" : "en")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 ml-1"
            >
              <FiGlobe size={14} />
              {lang === "en" ? "தமிழ்" : "English"}
            </button>

            {/* Auth */}
            {role ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-primary-dark hover:bg-primary-light transition-colors ml-1"
              >
                <FiLogOut size={14} /> {t("logout")}
              </button>
            ) : (
              <Link
                to="/login?role=admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors ml-1 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #f59e0b)",
                }}
              >
                <FiLogIn size={14} /> {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile right */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "ta" : "en")}
              className="text-xs border border-gray-200 px-2 py-1 rounded-lg text-gray-600"
            >
              {lang === "en" ? "தமிழ்" : "EN"}
            </button>
            <button
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2"
          >
            {publicLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium mb-1 ${pathname === to ? "bg-primary-light text-primary-dark" : "text-gray-700 hover:bg-gray-50"}`}
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
            {(role === "minister" || role === "admin") && (
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium mb-1 text-gray-700 hover:bg-gray-50"
              >
                <FiGrid size={20} />
                {t("dashboard")}
              </Link>
            )}
            {role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium mb-1 text-gray-700 hover:bg-gray-50"
              >
                <FiSettings size={20} />
                {t("admin")}
              </Link>
            )}
            {role ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium mb-1 text-primary-dark w-full"
              >
                <FiLogOut size={20} />
                {t("logout")}
              </button>
            ) : (
              <Link
                to="/login?role=admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium mb-1 text-primary-dark"
              >
                <FiLogIn size={20} />
                {t("login")}
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
