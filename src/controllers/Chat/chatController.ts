import { inject, injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { IChatService } from '../../Interfaces/Chat/IChatService';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { Request, Response } from 'express';

@injectable()
export class ChatController{
    constructor(
         @inject('IChatService') private readonly _chatService : IChatService
    ){}
    getAllUsers = asyncHandler(async (req: Request, res: Response) =>{
        try{
              const { userId } = req.params;
              console.log("Get alll users :",userId);
              const users = await  this._chatService.getAllUsers(userId);
              res.status(HttpStatusCode.OK).json({users});
        }catch(err){
             throw err;
        }
    })
    getMessages = asyncHandler(async (req: Request, res: Response) =>{
         try{
              const { sender, receiver } = req.query;
              console.log(' Get messages ::',sender,receiver);
              const messages = await this._chatService.getMessages(String(sender),String(receiver));
              console.log('Messsges sent to client !');
              res.status(HttpStatusCode.OK).json({messages});
         }catch(err){
            throw err;
         }
    });
}
