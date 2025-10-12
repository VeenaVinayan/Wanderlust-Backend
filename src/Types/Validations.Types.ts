
export type Travellers = {
  adult: number;
  children: number;
  infant: number;
}

export type  BookingInput = {
  email: string;
  phone: string;
  tripDate: string;
  bookingDate: string;
  totalAmount: number ;
  travellers: Travellers;
  userId: string;
  packageId:string;
  totalGuest:number;
}

interface ISanitizedTravellers {
  adult: number;
  children: number;
  infant: number;
}

export interface ISanitizedBooking {
  email: string ;
  phone: string;
  totalAmount: number;
  tripDate: Date | null;
  travellers: ISanitizedTravellers;
  bookingDate:Date | null;
  packageId: string;
  userId:string;
  totalGuest:number;
}