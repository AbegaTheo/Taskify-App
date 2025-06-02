const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Basse", "Moyenne", "Haute"],
    default: "Moyenne",
  },
  status: {
    type: String,
    enum: ["En Cours", "Terminée"],
    default: "En Cours",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
});

// Middleware pour synchroniser completed avec status
TaskSchema.pre('save', function(next) {
  if (this.status === 'Terminée') {
    this.completed = true;
    this.completedAt = Date.now();
  } else {
    this.completed = false;
    this.completedAt = null;
  }
  next();
});

// Middleware pour mettre à jour updatedAt avant de sauvegarder
TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware pour mettre à jour createdAt avant de sauvegarder
TaskSchema.pre('save', function(next) {
  if (!this.createdAt) {
    this.createdAt = Date.now();
  }
  next();
});

// Middleware pour mettre à jour updatedAt avant de mettre à jour
TaskSchema.pre('findOneAndUpdate', function(next) {
  this.update({}, { $set: { updatedAt: Date.now() } });
  next();
});

// Middleware pour mettre à jour completed et completedAt avant de mettre à jour
TaskSchema.pre('findOneAndUpdate', function(next) {
  this.update({}, { $set: { completed: false, completedAt: null } });
  next();
});

// Middleware pour mettre à jour createdAt avant de mettre à jour
TaskSchema.pre('findOneAndUpdate', function(next) {
  this.update({}, { $set: { createdAt: Date.now() } });
  next();
});

module.exports = mongoose.model('Tasks', TaskSchema);