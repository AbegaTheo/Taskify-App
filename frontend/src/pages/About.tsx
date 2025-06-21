import React from 'react';
import './Styles/About.css';

const About = () => {
  return (
    <section className="about-page">
      <div className="about-container">
        <h1 className="about-title">À propos de Taskify</h1>
        <p className="about-subtitle">Votre copilote productif 🚀</p>

        <div className="about-content">
          <p>
            <strong>Taskify</strong> est une application de gestion de tâches pensée pour les esprits ambitieux et organisés. 
            Que vous soyez étudiant, entrepreneur ou professionnel débordé, Taskify vous aide à :
          </p>
          <ul className="about-list">
            <li>✅ Organiser vos tâches de manière simple et intuitive</li>
            <li>📆 Visualiser votre planning avec notre calendrier intégré</li>
            <li>💡 Rester motivé avec des citations inspirantes</li>
            <li>📊 Suivre votre progression en temps réel</li>
          </ul>

          <p>
            Conçue avec ❤ par une équipe passionnée, Taskify a pour mission de booster votre productivité sans stress.
            Grâce à notre interface claire et responsive, gérez vos projets, où que vous soyez.
          </p>

          <div className="about-quote">
            <em>"L'organisation est la clé de la liberté." – Taskify, By Abel AGOH</em>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
