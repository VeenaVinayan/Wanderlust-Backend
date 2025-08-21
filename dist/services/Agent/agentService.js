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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const inversify_1 = require("inversify");
let AgentService = class AgentService {
    constructor(_agentRepository) {
        this._agentRepository = _agentRepository;
    }
    uploadCertificate(id, publicUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._agentRepository.uploadCertificate(id, publicUrl);
                if (result.acknowledged && result.matchedCount === 1 && result.modifiedCount === 1) {
                    return true;
                }
                return false;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._agentRepository.getCategories();
                const category = data.map((category) => ({
                    _id: category._id.toString(),
                    name: category.name,
                }));
                return category;
            }
            catch (err) {
                throw err;
            }
        });
    }
    createPackage(packageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return true;
            }
            catch (err) {
                console.log("Error in create Package !!");
                throw err;
            }
        });
    }
    getDashboardData(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._agentRepository.getDashboardData(agentId);
                if (data) {
                    return data;
                }
                else {
                    return {};
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IAgentRepository")),
    __metadata("design:paramtypes", [Object])
], AgentService);
