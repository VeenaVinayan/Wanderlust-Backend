"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const inversify_1 = require("inversify");
const Notification_1 = __importDefault(require("../../models/Notification"));
const BaseRepository_1 = require("../Base/BaseRepository");
(0, inversify_1.injectable)();
class NotificationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Notification_1.default);
        this._notificationModel = Notification_1.default;
    }
}
exports.NotificationRepository = NotificationRepository;
