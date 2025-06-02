const mongoose = require('mongoose'); // importation de mongoose pour la connexion à la base de données MongoDB
const bcrypt = require('bcryptjs'); // importation de bcryptjs pour le hachage du mot de passe

// Definition du schéma utilisateur dans la base de données MongoDB
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Veuillez entrer une adresse email valide.",
    ]
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tasks",
    },
  ],
});

// Middleware pour hacher le mot de passe avant de l'enregistrer dans la base de données
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Méthode pour comparer le mot de passe saisi avec le mot de passe stocké dans la base de données
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Users', UserSchema); // Exporte le modèle de données pour être utilisé dans d'autres fichiers