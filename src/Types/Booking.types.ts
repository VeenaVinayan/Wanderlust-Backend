export interface IBookingData{
    _id:string;
    bookingData?: string;
    userId: string;
    packageId: string;
    bookingDate: Date;
    totalGuest:number;
    totalAmount:number;
    paymentStatus: string;
    paymentDate: string;
    status: boolean; 
}

export interface FilterParams{
    id?: string;
    page:number;
    perPage:number;
    searchParams: {
       search: string;
       sortBy: string;
       sortOrder:string;
    }
}
export interface IWalletData{
     userId: string;
     amount:number;
     transaction: {
        trnasactionDate?:Date; 
        amount:number;
        description:string;
     }
}
export interface IDashBoardData{
    summary:{
        total:number;
        totalBooking:number;
        profit:number;
    },
    bookingsPerMonth:[{
         totalBookings:number;
         month:string;
    }]
}
