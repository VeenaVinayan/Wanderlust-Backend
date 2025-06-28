import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAgentService } from '../../Interfaces/Agent/IAgentService';
import asyncHandler from 'express-async-handler';
import { s3Service } from '../../config/s3Service';
import { HttpStatusCode } from '../../enums/HttpStatusCode';;
import { StatusMessage } from '../../enums/StatusMessage';
import { file } from 'googleapis/build/src/apis/file';

@injectable()
export class AgentController{
     constructor(
        @inject('IAgentService') private readonly _agentService : IAgentService
     ){}
    getPresignedUrl = asyncHandler(async(req: Request, res: Response) =>{
       const { fileType } = req.body;
       console.log('Get presigned url ::',fileType);
       if(!fileType){
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({message: "File types are required !"});
           return;    
        }
     try{
          const response = await s3Service.generateSignedUrl(fileType);
          console.log('After presigned urls ::',response);
          res.status(200).json({response});
     }catch(error){
       console.error('Error generating signed Urls:',error);
       res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
           .json({message:StatusMessage.INTERNAL_SERVER_ERROR});
     }
  });

  uploadCertificate = asyncHandler(async (req:Request, res:Response) =>{
     const { id } = req.params;
     const { publicUrl} = req.body;
     console.log('INside agent Controller !!!');
     const response = await this._agentService.uploadCertificate(id,publicUrl);
     if(response){
        res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS});
     }else{
        res.status(HttpStatusCode.OK).json({message:StatusMessage.ERROR});
     }
  });
 getCategories = asyncHandler(async (req: Request, res: Response) =>{
     console.log('Get Categories !!');
     const data = await this._agentService.getCategories();
     console.log("Categories ::", data);
     if(data){
         res.status(HttpStatusCode.OK).json({success:true,categories:data});
     }else{
         res.status(HttpStatusCode.NO_CONTENT).json({success:false,message:StatusMessage.ERROR});
     }
  });
  getSignedUrls = asyncHandler(async (req: Request, res: Response) =>{
     const { fileTypes } = req.body;
     if(!fileTypes){
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({message: "File types are required !"});
     return; 
     }
     try{
         const data = await s3Service.generateSignedUrls(fileTypes);
         console.log('After generating PreSigned Urls ::',data);
         res.status(HttpStatusCode.OK).json({message:StatusMessage.BAD_REQUEST,data});
     }catch(err){
        throw err;
     }
  });
  deleteImages = asyncHandler(async (req:Request,res: Response) => {
     try{
          console.log(' DElete Images ||');
          const deleteImages = req.body;
          console.log(" Images ::",deleteImages);
          await s3Service.deleteImages(deleteImages);
          res.status(HttpStatusCode.OK).json({message:StatusMessage.SUCCESS})
     }catch(err){
       throw err;
     }
  });
}
