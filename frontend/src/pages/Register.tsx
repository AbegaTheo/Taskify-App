import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PersonAddAlt1 as PersonAddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // ✅ Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  // ✅ Validation améliorée
  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Le nom d'utilisateur est obligatoire");
      return false;
    }
    
    if (!formData.email.trim()) {
      setError("L'email est obligatoire");
      return false;
    }
    
    if (!formData.password) {
      setError("Le mot de passe est obligatoire");
      return false;
    }
    
    if (!formData.confirmPassword) {
      setError("La confirmation du mot de passe est obligatoire");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Le mot de passe doit avoir au moins 6 caractères');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    
    // ✅ Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer un email valide');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("🔄 Tentative d'inscription...", { 
      username: formData.username, 
      email: formData.email 
    });
    
    setError('');
    
    // ✅ Validation avant envoi
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // ✅ Appel de la fonction register du contexte
      await register(
        formData.username, 
        formData.email, 
        formData.password, 
        formData.confirmPassword
      );
      
      console.log("✅ Inscription réussie");
      
      // ✅ Redirection vers le dashboard après inscription réussie
      // (car l'utilisateur est maintenant connecté automatiquement)
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error("❌ Erreur lors de l'inscription:", err);
      
      // ✅ Gestion d'erreurs améliorée
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Inscription</h2>
          <p>Créez votre compte Taskify gratuitement</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              ❌ {error}
            </div>
          )}
          
            <label htmlFor="username" className="label">
              Nom d'utilisateur
            </label>
            <div className="input-wrapper">
              <PersonIcon className="input-icon" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Votre nom d'utilisateur"
                disabled={loading}
              />
            </div>

            <label htmlFor="email" className="label">
              Adresse Email
            </label>
            <div className="input-wrapper">
              <EmailIcon className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="votre@email.com"
                disabled={loading}
              />
            </div>

            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <div className="input-wrapper">
              <LockIcon className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            <label htmlFor="confirmPassword" className="label">
              Confirmer le mot de passe
            </label>
            <div className="input-wrapper">
              <LockIcon className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={toggleConfirmPasswordVisibility}
                disabled={loading}
                aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

          <button
            type="submit"
            className={`auth-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            <PersonAddIcon className="auth-icon" />
            {loading ? 'Inscription en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Déjà un compte ?{' '}
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
