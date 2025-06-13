import { Request, Response } from 'express';
import { inject, injectable} from 'inversify';
import asyncHandler from 'express-async-handler';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';

@injectable()
export class AuthController{
 
}