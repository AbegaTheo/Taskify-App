// src/components/Navbar.tsx

import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";

import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBack, setShowBack] = useState(false);

  const navigate = useNavigate();
  const { loading, isAuthenticated, logout } = useAuth();

  if (loading) return null; // Ne rien afficher pendant le chargement

  const toggleAboutBack = () => {
    if (showBack) {
      navigate(-1);
    } else {
      navigate("/about");
    }
    setShowBack(!showBack);
  };

  const handleLogout = () => {
    logout();
    setTimeout(() => navigate("/"), 300);
  };

  return (
    <nav>
      <Link className="logo" to="/">
        <img src="/images/logo_1.jpg" alt="Logo Taskify" className="logo-icon" />
        Taskify
      </Link>

      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={menuOpen ? "open" : ""}>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/dashboard" className="dashboard-btn">
                <DashboardIcon className="btn-icon" fontSize="medium" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks" className="tasks-btn">
                <TaskIcon className="btn-icon" fontSize="medium" />
                Mes Tâches
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="logout-btn"
                type="button"
                title="Déconnexion"
              >
                <LogoutIcon className="btn-icon" fontSize="medium" />
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className="login-btn">
                Se connecter
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className="register-btn">
                S'inscrire
              </NavLink>
            </li>
          </>
        )}

        <li>
          <button
            onClick={toggleAboutBack}
            className="about-btn"
            type="button"
            title={showBack ? "Retour" : "À propos"}
          >
            {showBack ? (
              <>
                <ArrowBackIcon className="btn-icon" fontSize="medium" />
                Retour
              </>
            ) : (
              <>
                <InfoIcon className="btn-icon" fontSize="medium" />
                À Propos
              </>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
