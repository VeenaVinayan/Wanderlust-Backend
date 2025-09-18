import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { INotificationService } from "../../Interfaces/Notification/INotificationService";
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { StatusMessage } from "../../enums/StatusMessage";

@injectable()
export class NotificationController {
  constructor(
    @inject("INotificationService")
    private readonly _notificationService: INotificationService
  ) {}
  getAllNotification = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;
        const data = await this._notificationService.getAllNotifications(
          userId
        );
        if (data) {
          res
            .status(HttpStatusCode.OK)
            .json({ message: StatusMessage.SUCCESS, data });
        }
      } catch (err) {
        next(err);
      }
    }
  );
  changeNotificationStatus = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { notificationId } = req.params;
        const result = await this._notificationService.changeNotificationStatus(
          notificationId
        );
        if (result) {
          res.status(HttpStatusCode.OK).json({ success: true });
        } else {
          res.status(HttpStatusCode.BAD_REQUEST).json({ success: false });
        }
      } catch (err) {
        next(err);
      }
    }
  );
}
