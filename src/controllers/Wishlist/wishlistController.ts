import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { IWishlistService } from "../../Interfaces/Wishlist/IWishlistService";
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { StatusMessage } from "../../enums/StatusMessage";

import asyncHandler from "express-async-handler";

@injectable()
export class WishlistController {
  constructor(
    @inject("IWishlistService")
    private readonly _wishlistService: IWishlistService
  ) {}
  addToWishlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId, packageId } = req.body;
        const result = await this._wishlistService.isExistWishlist(
          userId,
          packageId
        );
        if (!result) {
          const data = await this._wishlistService.addToWishlist(
            userId,
            packageId
          );
          if (data) {
            res
              .status(HttpStatusCode.OK)
              .json({ message: StatusMessage.SUCCESS });
          } else {
            res
              .status(HttpStatusCode.NOT_FOUND)
              .json({ messgae: StatusMessage.NOT_FOUND });
          }
        } else {
          res
            .status(HttpStatusCode.CONFLICT)
            .json({ message: StatusMessage.CONFLICT });
        }
      } catch (err) {
        next(err);
      }
    }
  );
  getWishlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.query;
        const result = await this._wishlistService.getWishlist(String(userId));
        if (result)
          res.status(HttpStatusCode.OK).json({ success: true, data: result });
        else res.status(HttpStatusCode.NO_CONTENT).json({ success: false });
      } catch (err) {
        next(err);
      }
    }
  );
  deleteWishlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { wishlistId } = req.query;
        const result = await this._wishlistService.deleteWishlist(
          String(wishlistId)
        );
        if (result) {
          res
            .status(HttpStatusCode.OK)
            .json({ message: StatusMessage.DELETED });
        } else {
          res
            .status(HttpStatusCode.NOT_FOUND)
            .json({ message: StatusMessage.NOT_FOUND });
        }
      } catch (err) {
        next(err);
      }
    }
  );
}
