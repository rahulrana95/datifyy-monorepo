import { body } from 'express-validator';

export const validateEvent = [
  body('eventdate').isISO8601().withMessage('Event date must be in ISO format'),
  body('totalmenstickets').isInt({ min: 0 }).withMessage('Must be a positive integer'),
  body('totalfemaletickets').isInt({ min: 0 }).withMessage('Must be a positive integer'),
  body('menticketprice').isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('womenticketprice').isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('currencycode').isLength({ min: 3, max: 3 }).withMessage('Currency code must be 3 letters'),
  body('mode').isIn(['online', 'offline']).withMessage('Mode should be "online" or "offline"'),
  body('type').isString().isLength({ max: 20 }).withMessage('Type should be a valid string'),
  body('title').isString().isLength({ max: 255 }).withMessage('Title is required and should be less than 255 chars'),
  body('status').isString().isLength({ max: 20 }).withMessage('Status must be a valid string'),
  body('maxcapacity').isInt({ min: 0 }).withMessage('Max capacity must be a positive integer'),
];