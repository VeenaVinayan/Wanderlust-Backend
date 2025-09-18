import { inject, injectable } from "inversify";
import { IBookingService } from "../../Interfaces/Booking/IBookingService";
import { IBookingRepository } from "../../Interfaces/Booking/IBookingRepository";
import { IBookingData, IDashBoardData } from "../../Types/Booking.types";
import { IBooking } from "../../models/Booking";
import { FilterParams, IWalletData } from "../../Types/Booking.types";
import mailSender from "../../utils/mailSender";
import EmailHelper from "../../helper/emailHelper";
import { differenceInDays } from "date-fns";
import { TNotification } from "../../Types/notification";
import { INotificationService } from "../../Interfaces/Notification/INotificationService";
import { IBookingValue, IBookingCompleteData } from "../../Types/Booking.types";
import { IBookingValidationResult } from "../../Types/Booking.types";
import { ISummary } from "../../Types/Booking.types";
import { CancellBookingResult } from "../../enums/PasswordReset";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("INotificationService")
    private readonly _notificationService: INotificationService
  ) {}
  async bookPackage(bookingData: IBookingData): Promise<IBooking> {
    try {
      const result = await this._bookingRepository.createNewData(bookingData);
      const data: IBookingValue | null =
        await this._bookingRepository.getAgentData(result._id);
      if (result && data) {
        const notification: TNotification = {
          userId: data.agentId.toString(),
          title: "New Booking",
          message: `${data.userName} is created new booking of package ${data.packageName}`,
        };
        await this._notificationService.createNewNotification(notification);
      }
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
  async getBookingData(filterParams: FilterParams): Promise<object> {
    try {
      return await this._bookingRepository.getBookingData(filterParams);
    } catch (error) {
      console.log(error);
      throw new Error("Internal server error");
    }
  }
  async sendConfirmationEmail(bookingData: IBooking): Promise<void> {
    try {
      const bookingValue: IBookingCompleteData =
        await this._bookingRepository.getBookingCompleteData(bookingData._id);
      if (!bookingValue) {
        throw new Error("Package not found");
      }
      {
        const { email, body, title } =
          EmailHelper.generateBookingEmailBody(bookingValue);
        await mailSender(email, title, body);
      }
      {
        const { email, body, title } =
          EmailHelper.generateBookingNotificationToAgent(bookingValue);
          await mailSender(email, title, body);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async getAgentBookingData(filterParams: FilterParams): Promise<object> {
    try {
      const data = await this._bookingRepository.getAgentBookingData(
        filterParams
      );
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async updateBookingStatusByAgent(
    bookingId: string,
    status: string
  ): Promise<IBooking | null> {
    try {
      const bookingData: IBooking | null =
        await this._bookingRepository.findOneById(bookingId);
      if (!bookingData) {
        console.log(" No booking data found.");
        throw new Error("Booking not found");
      }
      if (bookingData.tripStatus === status) {
        throw new Error(`Booking is already marked as ${status}`);
      }

      const now = new Date();
      const tripDate = new Date(bookingData.tripDate);
      if (status === "Completed" && tripDate > now) {
        throw new Error("Trip has not yet occurred. Cannot mark as Completed.");
      }
      if (status === "Cancelled" && bookingData.tripStatus === "Completed") {
        throw new Error("Completed trips cannot be cancelled.");
      }
      const updatedBooking: IBooking | null =
        await this._bookingRepository.updateOneById(bookingId, {
          tripStatus: status,
          paymentStatus:
            status === "Cancelled" ? "Refunded" : bookingData.paymentStatus,
        });

      if (updatedBooking && status === "Cancelled") {
        const walletData: IWalletData = {
          userId: bookingData.userId,
          amount: bookingData.totalAmount,
          transaction: {
            amount: bookingData.totalAmount,
            bookingId: bookingData.bookingId,
            description: "Booking cancelled by agent — amount refunded",
          },
        };
        const refundResult = await this.addToWallet(walletData);
        if (!refundResult) {
          console.error("⚠️ Wallet refund failed");
          throw new Error("Booking was cancelled, but refund failed");
        }
      
        {
          const bookingData =
            await this._bookingRepository.getBookingCompleteData(bookingId);
          const { email, body, title } =
            EmailHelper.generateBookingEmailBody(bookingData);
          await mailSender(email, title, body);
        }
      }
      return updatedBooking;
    } catch (error) {
      console.error("  Error updating booking status:");
      throw error;
    }
  }
  async getBookingDataToAdmin(filterParams: FilterParams): Promise<object> {
    const data = await this._bookingRepository.getBookingDataToAdmin(
      filterParams
    );
    return data;
  }
  async cancelBooking(id: string): Promise<CancellBookingResult> {
    const bookingData: IBooking | null =
      await this._bookingRepository.findOneById(id);
    if (!bookingData) {
      return CancellBookingResult.ID_NOT_FOUND;
    }
    if (bookingData.tripStatus !== "Cancelled") {
      const today = new Date();
      const bookingDate = new Date(bookingData.tripDate);
      const day = differenceInDays(bookingDate, today);
      if (day >= 4) {
        const cancellationFee = bookingData?.totalAmount * 0.2;
        const amount = Math.floor(bookingData.totalAmount * 0.8);
        const result = await this._bookingRepository.updateOneById(id, {
          tripStatus: "Cancelled",
          paymentStatus: "Refunded",
        });
        const wallet = await this._bookingRepository.getWallet(
          bookingData.userId
        );
        console.log(
          "Value in Cancel Booking ::",
          result,
          wallet,
          amount,
          cancellationFee
        );
        if (!wallet) {
          const walletData: IWalletData = {
            userId: bookingData.userId,
            amount: amount,
            transaction: {
              amount,
              description: "Cancellation balance payment credited",
              bookingId: bookingData.bookingId,
            },
          };
          await this._bookingRepository.creditToWallet(walletData);
        } else {
          await this._bookingRepository.updateWallet(
            bookingData.userId,
            amount,
            bookingData.bookingId,
            "Cancellation Balance payment credited !"
          );
        }
        const data: IBookingValue | null =
          await this._bookingRepository.getAgentData(id);
        if (data) {
          const notification = {
            userId: data.agentId.toString(),
            title: "Booking",
            message: `The booking of ${data.packageName} is cancelled by ${data.userName}`,
          };
          await this._notificationService.createNewNotification(notification);
          const userNotification = {
            userId: bookingData.userId.toString(),
            title: "Refuned amount",
            message: `The amount ${amount} refunded after cancellation of ${data.packageName} !`,
          };
          await this._notificationService.createNewNotification(
            userNotification
          );
        }
        return CancellBookingResult.SUCCESS;
      } else {
        return CancellBookingResult.EXCEEDED_CANCELLATION_LIMIT;
      }
    } else {
      return CancellBookingResult.ALREADY_CANCELLED;
    }
  }
  async getPackageBookingData(filterParams: FilterParams): Promise<object> {
    return await this._bookingRepository.getPackageBookingData(filterParams);
  }
  async validateBooking(
    packageId: string,
    day: Date
  ): Promise<IBookingValidationResult | null> {
    const data: IBookingValidationResult | null =
      await this._bookingRepository.validateBooking(packageId, day);
    return data;
  }
  async getDashboard(): Promise<IDashBoardData | null> {
    const data = (await this._bookingRepository.getDashboard()) as {
      summary: ISummary[];
      bookingsPerMonth: Array<{
        _id: { month: number; year: number };
        totalBookings: number;
        totalRevenue: number;
      }>;
      topPackages: Array<{ packageName: string; value: 1 }>;
    } | null;
    if (!data) return null;
    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const chartData = data.bookingsPerMonth?.map((item) => ({
      totalBookings: item.totalBookings,
      month: MONTHS[item._id.month - 1],
    }));

    const dashboardData: IDashBoardData = {
      summary: data?.summary[0],
      bookingsPerMonth: chartData,
      topPackages: data?.topPackages,
    };
    return dashboardData;
  }
  async addToWallet(walletData: IWalletData): Promise<boolean> {
    const wallet = await this._bookingRepository.getWallet(walletData.userId);
    if (!wallet) {
      const result = await this._bookingRepository.creditToWallet(walletData);
      return !!result;
    } else {
      const result = await this._bookingRepository.updateWallet(
        walletData.userId,
        walletData.amount,
        walletData.transaction.bookingId,
        walletData.transaction.description
      );
      return !!result;
    }
  }
}
