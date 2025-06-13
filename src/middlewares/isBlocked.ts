import { Request, Response, NextFunction } from "express";
import User from "../models/User";

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
      res.status(401).json({ message: "Unauthorized: User ID not found" });
      return;
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user.status) {
      console.log("Block User !! true !!");
      res.status(403).json({ message: "Access denied: You have been blocked" });
      return;
    }
    next();
  }catch (error) {
    console.error("Error in isBlocked middleware", error);
    res.status(500).json({ message: "Server error" });
  }
};

