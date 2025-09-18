import { Request, Response, NextFunction } from 'express';
import { bookingValidation, sanitizeBooking } from '../validators/BookingValidations';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { StatusMessage } from '../enums/StatusMessage';

export const validation = (req: Request, res: Response, next: NextFunction) => {
  const errors = bookingValidation(req.body); 
 
  if (errors.length > 0) {
     res.status(HttpStatusCode.BAD_REQUEST).json({error:true,message:StatusMessage.BAD_REQUEST});
     return;
  }
  req.body = sanitizeBooking(req.body); 
    next();
};

