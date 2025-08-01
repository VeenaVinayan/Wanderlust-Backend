import { IBaseRepository } from "../Base/IBaseRepository";
import { IBooking } from "../../models/Booking";
import { FilterParams , IWalletData} from "../../Types/Booking.types";
import { IWallet } from '../../models/Wallet';
import { IBookingValue, IBookingCompleteData } from '../../Types/Booking.types';
import { IBookingValidationResult } from '../../Types/Booking.types';

export interface IBookingRepository extends IBaseRepository<IBooking>{
   getBookingData(filterParams: FilterParams): Promise<Object>;
   getAgentBookingData(filterParams: FilterParams) : Promise<Object>
   getBookingDataToAdmin(filterPrams : FilterParams): Promise<Object>;
   creditToWallet(walletData : IWalletData) : Promise<IWallet>;
   getWallet(userId : string) : Promise<IWallet | null>;
   updateWallet(userId : string, amount: number,description : string):Promise<Object>;
   getPackageBookingData(filterParams : FilterParams): Promise<Object>;
   getPackageDetails(packageId: string): Promise<Object | null> ;
   getDashboard():Promise<Object | null>;
   getBookingCompleteData(bookingId : string) :Promise<IBookingCompleteData>;
   getAgentData(bookingId : string) : Promise<IBookingValue | null>;
   validateBooking(packageId : string,tripDate :Date):Promise<IBookingValidationResult>;
}
