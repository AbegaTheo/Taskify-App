import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-image">
          <img 
            src="/images/Hero.jpg" 
            alt="Gestion de tâches" 
            className="hero-image"
          />
        </div>
        
        <div className="home-text">
          <h1 className="home-title">
            Organisez votre vie avec 
            <span className="highlight"> Taskify</span>
          </h1>
          
          <p className="home-description">
            Gérez vos tâches quotidiennes de manière efficace et intuitive. 
            Taskify vous aide à rester organisé et productif avec une interface 
            simple et élégante.
          </p>
          
          <div className="home-features">
            <div className="feature">
              <span className="feature-icon">✅</span>
              <span>Gestion simple des tâches</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📅</span>
              <span>Planification intelligente</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>Suivi des priorités</span>
            </div>
          </div>
          
          <div className="home-buttons">
            <Link to="/register" className="btnLink btn-primary">
              Commencer gratuitement
            </Link>
            <Link to="/login" className=" btnLink btn-secondary">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
