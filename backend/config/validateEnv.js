// config/validateEnv.js

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `❌ Les variables d'environnement suivantes sont manquantes : ${missing.join(', ')}`.red.bold
    );
    process.exit(1); // Arrête le serveur
  }
};

export default validateEnv;
