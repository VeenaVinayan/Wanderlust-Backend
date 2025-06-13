
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
}
