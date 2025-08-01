import { NextFunction , Request, Response } from "express";

const notFound = (req:Request, res: Response, next: NextFunction) : void =>{
        const error = new Error(`Not Found -${req.originalUrl}`);
        res.status(404);
        next(error);
}
function isCastError(error: unknown): error is { name: string; kind: string } {
  return (
      typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        'kind' in error &&
        (error as { name: string }).name === 'CastError' &&
        (error as { kind: string }).kind === 'ObjectId'
    );
}

const  ErrorHandler= (err : unknown, req: Request, res: Response, next: NextFunction): void => {
       let statusCode = res.statusCode === 200 ? 500 : res.statusCode ;
       if(err instanceof Error){ 
       let message = err.message;
        
       if(isCastError(err)){
              statusCode = 404;
              message = "Resource Not Found";
         }

         res.status(statusCode).json({
             message,
             stack:process.env.NODE_ENV === 'production' ? null : err.stack
         })
       } 
    
}
export default ErrorHandler;