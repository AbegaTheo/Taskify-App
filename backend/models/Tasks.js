import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    description: {
      type: String,
      minlength: 3,
      maxlength: 500,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['Faible', 'Moyenne', 'Haute'],
      default: 'Moyenne',
    },
    status: {
      type: String,
      enum: ['En Cours', 'Terminée'],
      default: 'En Cours',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
  },
  {
    timestamps: true,
  }
);

// Synchroniser status -> completed
TaskSchema.pre('save', function (next) {
  if (this.status === 'Terminée') {
    this.completed = true;
    this.completedAt = Date.now();
  } else {
    this.completed = false;
    this.completedAt = null;
  }
  next();
});

// Synchroniser aussi lors des updates
TaskSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  const set = update.$set || {};

  if (set.status === 'Terminée') {
    set.completed = true;
    set.completedAt = Date.now();
  } else if (set.status) {
    set.completed = false;
    set.completedAt = null;
  }

  this.setUpdate({ ...update, $set: set });
  next();
});

export default mongoose.model('Tasks', TaskSchema);
