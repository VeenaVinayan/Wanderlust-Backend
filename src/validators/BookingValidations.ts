import validator from 'validator';
import { BookingInput, ISanitizedBooking } from '../Types/Validations.Types';

export const bookingValidation = (bookingData: BookingInput): string[] => {
  const { userId, packageId , bookingDate , totalGuest,  tripDate, travellers, totalAmount, email, phone } = bookingData;
  const errors: string[] = [];

  if (!tripDate || !validator.isISO8601(tripDate)) {
     errors.push("Trip Date is not a valid ISO date!");
  }

  if(!userId){
     errors.push("User Id missing");
  } 
  if(packageId){
     errors.push("Package Id is Missing !");
  }
  if(totalGuest){
     errors.push("Total Guesst is missing !");
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
  if(!bookingDate || !validator.isISO8601(bookingDate)){
     errors.push("Booking Date Invalid!");
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
    userId:validator.trim(bookingData.userId),
    packageId:validator.trim(bookingData.packageId),
    totalGuest: parseInt(bookingData.bookingDate),
    email: validator.normalizeEmail(bookingData.email) || '',
    totalAmount: parseFloat(bookingData.totalAmount.toString()),
    phone: validator.trim(bookingData.phone || ''),
    tripDate: validator.toDate(bookingData.tripDate?.toString() || '') || null,
    bookingDate:validator.toDate(bookingData.bookingDate?.toString() || '') || null,
    travellers: {
      adult: parseInt(bookingData.travellers?.adult?.toString() || '0'),
      children: parseInt(bookingData.travellers?.children?.toString() || '0'),
      infant: parseInt(bookingData.travellers?.infant?.toString() || '0'),
    }
  };
};


