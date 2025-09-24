import validator from 'validator';
import { BookingInput, ISanitizedBooking } from '../Types/Validations.Types';

export const bookingValidation = (bookingData: BookingInput): string[] => {
  const { tripDate, travellers, totalAmount, email, phone } = bookingData;
  const errors: string[] = [];

  if (!tripDate || !validator.isISO8601(tripDate)) {
     errors.push("Trip Date is not a valid ISO date!");
  }

  if (!email || !validator.isEmail(email)) {
    errors.push("Email is not valid!");
  }

  if (!phone || !validator.isMobilePhone(phone)) {
    errors.push("Mobile phone number is not valid!");
  }

  if (totalAmount === undefined || !validator.isNumeric(totalAmount.toString())) {
    errors.push("Total amount is not valid!");
  }

  if (!travellers) {
    errors.push("Travellers data is missing!");
  } else {
    if (
      !validator.isInt(travellers.adult?.toString()) ||
      !validator.isInt(travellers.children?.toString()) ||
      !validator.isInt(travellers.infant?.toString())
    ) {
      errors.push("Traveller counts must be valid integers!");
    }
  }
  return errors;
};

export const sanitizeBooking = (bookingData: BookingInput): ISanitizedBooking => {
  return {
    email: validator.normalizeEmail(bookingData.email) || '',
    totalAmount: parseFloat(bookingData.totalAmount.toString()),
    phone: validator.trim(bookingData.phone || ''),
    tripDate: validator.toDate(bookingData.tripDate?.toString() || '') || null,
    travellers: {
      adult: parseInt(bookingData.travellers?.adult?.toString() || '0'),
      children: parseInt(bookingData.travellers?.children?.toString() || '0'),
      infant: parseInt(bookingData.travellers?.infant?.toString() || '0'),
    }
  };
};


