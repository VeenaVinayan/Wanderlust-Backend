
import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand, 
  DeleteObjectsCommand 
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

dotenv.config();

class S3Service {
    private _s3: S3Client;
    private _bucket: string;

    constructor() { 
        this._s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY!,
            }, 
            region: process.env.AWS_REGION,
        });
        this._bucket = process.env.AWS_BUCKET_NAME!;
    }
   async generateSignedUrls(fileTypes: string[]): Promise<Array<{
        signedUrl: string;
        fileKey: string;
        publicUrl: string;
    }>> {
        console.log("File Types ||", fileTypes);
        return Promise.all(
            fileTypes.map(async (fileType: string) => {
                const typeName = fileType;
                const fileKey = `image_${Date.now()}_${Math.random().toString(36).substring(7)}.${typeName}`;

                const params = new PutObjectCommand({
                    Bucket: this._bucket,
                    Key: fileKey,
                    ContentType: fileType,
                });

                const signedUrl = await getSignedUrl(this._s3, params, {
                    expiresIn:  3600,
                    signableHeaders: new Set(['content-type']),
                });

                return {
                    signedUrl,
                    fileKey,
                    publicUrl: `https://${this._bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
                };
            })
        );
    }

    async generateSignedUrl(fileType: string): Promise<{
        signedUrl: string;
        fileKey: string;
        publicUrl: string;
    }> {
        const fileKey = `image_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileType.split('/')[1]}`;

        const params = new PutObjectCommand({
            Bucket: this._bucket,
            Key: fileKey,
            ContentType: fileType,
        });

        const signedUrl = await getSignedUrl(this._s3, params, {
            expiresIn: 3600,
        });

        return {
            signedUrl,
            fileKey,
            publicUrl: `https://${this._bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`, 
        };
    }

    async deleteImage(imageUrl: string): Promise<void> {
        try {
            const key = imageUrl.split(".com/")[1];

            const params = new DeleteObjectCommand({
                Bucket: this._bucket,
                Key: key,
            });

            await this._s3.send(params);
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    }
   
    async deleteImages(imageUrls: string[]): Promise<void> {
        try {
            const keys = imageUrls.map((url) => ({ Key: url.split(".com/")[1] }));

            new DeleteObjectsCommand({
                Bucket: this._bucket,
                Delete: { Objects: keys },
            });
          } catch (error: unknown) {
            console.error("Error deleting images:", error);
        }
    }
}

export const s3Service = new S3Service();
