import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAgentService } from "../../Interfaces/Agent/IAgentService";
import asyncHandler from "express-async-handler";
import { s3Service } from "../../config/s3Service";
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { StatusMessage } from "../../enums/StatusMessage";

@injectable()
export class AgentController {
  constructor(
    @inject("IAgentService") private readonly _agentService: IAgentService
  ) {}
  getPresignedUrl = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { fileType } = req.body;
      if (!fileType) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: StatusMessage.MISSING_REQUIRED_FIELD });
        return;
      }
      try {
        const response = await s3Service.generateSignedUrl(fileType);
        res.status(200).json({ response });
      } catch (error) {
        next(error);
      }
    }
  );

  uploadCertificate = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { publicUrl } = req.body;
    if (!userId || !publicUrl) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: StatusMessage.MISSING_REQUIRED_FIELD });
      return;
    }
    const response = await this._agentService.uploadCertificate(
      userId,
      publicUrl
    );
    if (response) {
      res.status(HttpStatusCode.OK).json({ message: StatusMessage.SUCCESS });
    } else {
      res.status(HttpStatusCode.OK).json({ message: StatusMessage.ERROR });
    }
  });
  getCategories = asyncHandler(async (req: Request, res: Response) => {
    const data = await this._agentService.getCategories();
    if (data) {
      res.status(HttpStatusCode.OK).json({ success: true, categories: data });
    } else {
      res
        .status(HttpStatusCode.NO_CONTENT)
        .json({ success: false, message: StatusMessage.ERROR });
    }
  });
  getSignedUrls = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { fileTypes } = req.body;
      if (!fileTypes) {
        res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .json({ message: "File types are required !" });
        return;
      }
      try {
        const data = await s3Service.generateSignedUrls(fileTypes);
        res
          .status(HttpStatusCode.OK)
          .json({ message: StatusMessage.BAD_REQUEST, data });
      } catch (err) {
        next(err);
      }
    }
  );
  deleteImages = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const deleteImages = req.body;
        await s3Service.deleteImages(deleteImages);
        res.status(HttpStatusCode.OK).json({ message: StatusMessage.SUCCESS });
      } catch (err) {
        next(err);
      }
    }
  );
  getDashboardData = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { agentId } = req.params;
        const data = await this._agentService.getDashboardData(agentId);
        res
          .status(HttpStatusCode.OK)
          .json({ message: StatusMessage.SUCCESS, data });
      } catch (err) {
        next(err);
      }
    }
  );
}
