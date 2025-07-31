import { IBookingData , FilterParams} from "../../Types/Booking.types";
import { IBooking } from "../../models/Booking";
import { IDashBoardData } from "../../Types/Booking.types";
import { IBookingValidationResult } from "../../Types/Booking.types";
import { CancellBookingResult } from "../../enums/PasswordReset";

export interface IBookingService {
    bookPackage(bookingData: IBookingData): Promise<IBooking>;
    getBookingData(filterParams : FilterParams): Promise<Object>;
    sendConfirmationEmail(bookingData: IBooking): Promise<void>;
    getAgentBookingData(filterParams : FilterParams) : Promise<Object>
    updateBookingStatusByAgent(bookingId : string,status: string): Promise<IBooking | null>
    getBookingDataToAdmin(filterParams : FilterParams): Promise<Object>;
    cancelBooking(id : string): Promise<CancellBookingResult>;
    getPackageBookingData(filterParams : FilterParams): Promise<Object>;
    validateBooking(packageId : string, day : Date) :Promise<IBookingValidationResult | null>;
    getDashboard():Promise<IDashBoardData | null>;
}