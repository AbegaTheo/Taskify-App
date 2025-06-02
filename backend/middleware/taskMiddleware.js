const { body, validationResult } = require('express-validator');

// Validation pour la création de tâche
const validateTaskCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Le titre est requis")
    .isLength({ min: 3, max: 100 })
    .withMessage("Le titre doit contenir entre 3 et 100 caractères"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La description ne peut pas dépasser 500 caractères"),

  body("priority")
    .optional()
    .isIn(["Basse", "Moyenne", "Haute"])
    .withMessage("La priorité doit être Basse, Moyenne ou Haute"),

  body("status")
    .optional()
    .isIn(["En cours", "Terminée"])
    .withMessage("Le statut doit être En cours ou Terminée"),

  body("dueDate")
    .notEmpty()
    .withMessage("La date d'échéance est requise")
    .isISO8601()
    .withMessage("Format de date invalide")
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(value);

      if (dueDate < today) {
        throw new Error("La date d'échéance ne peut pas être dans le passé");
      }
      return true;
    }),
];

// Validation pour la mise à jour de tâche
const validateTaskUpdate = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Le titre est requis")
    .isLength({ min: 3, max: 100 })
    .withMessage("Le titre doit contenir entre 3 et 100 caractères"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La description ne peut pas dépasser 500 caractères"),

  body("priority")
    .optional()
    .isIn(["Basse", "moyenne", "Haute"])
    .withMessage("La priorité doit être Basse, Moyenne ou Haute"),

  body("status")
    .optional()
    .isIn(["En Cours", "Terminée"])
    .withMessage(
      "Le statut doit être En Cours ou Terminée"
    ),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Format de date invalide")
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(value);

      if (dueDate < today) {
        throw new Error("La date d'échéance ne peut pas être dans le passé");
      }
      return true;
    }),
];

module.exports = {
  validateTaskCreation,
  validateTaskUpdate,
};