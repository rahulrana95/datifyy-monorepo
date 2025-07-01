import { body } from 'express-validator';

export const adminValidation = {
  updateEnums: [
    body('enums')
      .isArray()
      .withMessage('Enums must be an array')
      .notEmpty()
      .withMessage('Enums array cannot be empty'),
    body('enums.*.name')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Enum name is required')
      .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
      .withMessage('Enum name must be a valid identifier'),
    body('enums.*.values')
      .isArray()
      .withMessage('Enum values must be an array')
      .notEmpty()
      .withMessage('Enum values cannot be empty'),
    body('enums.*.values.*')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Enum value cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Enum value must be less than 255 characters')
  ]
};
