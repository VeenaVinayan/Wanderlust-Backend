import { IBookingData , FilterParams} from "../../Types/Booking.types";
import { IBooking } from "../../models/Booking";
import { IDashBoardData } from "../../Types/Booking.types";

export interface IBookingService {
    bookPackage(bookingData: IBookingData): Promise<IBooking>;
    getBookingData(filterParams : FilterParams): Promise<Object>;
    sendConfirmationEmail(bookingData: IBooking): Promise<void>;
    getAgentBookingData(filterParams : FilterParams) : Promise<Object>
    updateBookingStatusByAgent(bookingId : string,status: string): Promise<IBooking | null>
    getBookingDataToAdmin(filterParams : FilterParams): Promise<Object>;
    cancelBooking(id : string): Promise<boolean>
    getPackageBookingData(filterParams : FilterParams): Promise<Object>;
    validateBooking(bookingData :IBookingData) :Promise<boolean>;
    getDashboard():Promise<IDashBoardData | null>;
}