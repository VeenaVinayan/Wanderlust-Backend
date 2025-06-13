"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protected_1 = __importDefault(require("../middlewares/protected"));
const roleAuth_1 = require("../middlewares/roleAuth");
const container_1 = require("../config/container");
const router = express_1.default.Router();
const roleAuth = new roleAuth_1.RoleAuth();
const packageController = container_1.container.get('PackageController');
router.post('/package', protected_1.default, roleAuth.checkRole(['Agent']), packageController.addPackage);
exports.default = router;
