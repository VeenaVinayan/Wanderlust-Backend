import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { StatusMessage } from "../enums/StatusMessage";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

export const isBlocked = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ message: StatusMessage.UNAUTHORIZED });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(HttpStatusCode.NOT_FOUND).json({ message:StatusMessage.USER_NOT_FOUND });
      return;
    }
    if (!user.status) {
        res.status(HttpStatusCode.FORBIDDEN).json({ message: StatusMessage.BLOCKED });
      return;
    }
    next();
  }catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
  }
};

