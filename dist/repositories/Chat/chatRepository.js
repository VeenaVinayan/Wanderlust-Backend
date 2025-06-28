"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.ChatRepository = void 0;
const inversify_1 = require("inversify");
const BaseRepository_1 = require("../Base/BaseRepository");
const Message_1 = __importDefault(require("../../models/Message"));
const mongoose_1 = __importDefault(require("mongoose"));
let ChatRepository = class ChatRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Message_1.default);
        this._messageModel = Message_1.default;
    }
    getAllUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                const chatUsers = yield Message_1.default.aggregate([
                    {
                        $match: {
                            $or: [
                                { sender: userObjectId },
                                { receiver: userObjectId }
                            ]
                        }
                    },
                    {
                        $project: {
                            otherUser: {
                                $cond: [
                                    { $eq: ["$sender", userObjectId] },
                                    "$receiver",
                                    "$sender"
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$otherUser"
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "user"
                        }
                    },
                    {
                        $unwind: "$user"
                    },
                    {
                        $project: {
                            _id: "$user._id",
                            name: "$user.name",
                        }
                    }
                ]);
                console.log("Chat users ::", chatUsers);
                return chatUsers;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getMessages(sender, receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this._messageModel.find({
                    $or: [
                        { sender: sender, receiver: receiver },
                        { sender: receiver, receiver: sender }
                    ]
                });
                console.log("Messages ::", messages);
                return messages;
            }
            catch (err) {
                console.error('Error in Get Messages ::', err);
                throw err;
            }
        });
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ChatRepository);
