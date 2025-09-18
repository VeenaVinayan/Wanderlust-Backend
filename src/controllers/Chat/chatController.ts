import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { IChatService } from "../../Interfaces/Chat/IChatService";
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { StatusMessage } from "../../enums/StatusMessage";

import { NextFunction, Request, Response } from "express";
import { IChatUserDTO } from "../../DTO/chatDTO";
import { TMessage } from "../../Types/chat.types";

@injectable()
export class ChatController {
  constructor(
    @inject("IChatService") private readonly _chatService: IChatService
  ) {}
  getAllUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { userId } = req.params;
        if (!userId) {
          res
            .status(HttpStatusCode.BAD_REQUEST)
            .json({ message: StatusMessage.BAD_REQUEST });
          return;
        }
        const users: IChatUserDTO[] | null =
          await this._chatService.getAllUsers(userId);
        res.status(HttpStatusCode.OK).json({ users });
      } catch (err) {
        next(err);
      }
    }
  );
  getMessages = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { sender, receiver } = req.query;
        if (!sender || !receiver) {
          res
            .status(HttpStatusCode.BAD_REQUEST)
            .json({ message: StatusMessage.BAD_REQUEST });
          return;
        }
        const messages: TMessage[] = await this._chatService.getMessages(
          String(sender),
          String(receiver)
        );
        res.status(HttpStatusCode.OK).json({ messages });
      } catch (err) {
        next(err);
      }
    }
  );
}
