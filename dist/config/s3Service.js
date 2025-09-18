"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class S3Service {
    constructor() {
        this._s3 = new client_s3_1.S3Client({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
            },
            region: process.env.AWS_REGION,
        });
        this._bucket = process.env.AWS_BUCKET_NAME;
    }
    generateSignedUrls(fileTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("File Types ||", fileTypes);
            return Promise.all(fileTypes.map((fileType) => __awaiter(this, void 0, void 0, function* () {
                const typeName = fileType;
                const fileKey = `image_${Date.now()}_${Math.random().toString(36).substring(7)}.${typeName}`;
                const params = new client_s3_1.PutObjectCommand({
                    Bucket: this._bucket,
                    Key: fileKey,
                    ContentType: fileType,
                });
                const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(this._s3, params, {
                    expiresIn: 3600,
                    signableHeaders: new Set(['content-type']),
                });
                return {
                    signedUrl,
                    fileKey,
                    publicUrl: `https://${this._bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
                };
            })));
        });
    }
    generateSignedUrl(fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileKey = `image_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileType.split('/')[1]}`;
            const params = new client_s3_1.PutObjectCommand({
                Bucket: this._bucket,
                Key: fileKey,
                ContentType: fileType,
            });
            const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(this._s3, params, {
                expiresIn: 3600,
            });
            return {
                signedUrl,
                fileKey,
                publicUrl: `https://${this._bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
            };
        });
    }
    deleteImage(imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const key = imageUrl.split(".com/")[1];
                const params = new client_s3_1.DeleteObjectCommand({
                    Bucket: this._bucket,
                    Key: key,
                });
                yield this._s3.send(params);
            }
            catch (error) {
                console.error("Error deleting image:", error);
            }
        });
    }
    deleteImages(imageUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = imageUrls.map((url) => ({ Key: url.split(".com/")[1] }));
                new client_s3_1.DeleteObjectsCommand({
                    Bucket: this._bucket,
                    Delete: { Objects: keys },
                });
            }
            catch (error) {
                console.error("Error deleting images:", error);
            }
        });
    }
}
exports.s3Service = new S3Service();
