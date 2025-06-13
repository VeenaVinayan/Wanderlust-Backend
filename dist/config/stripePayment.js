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
const stripe_1 = __importDefault(require("stripe"));
class StripeService {
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET, {
            apiVersion: '2025-03-31.basil'
        });
    }
    createCheckoutSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield this.stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    line_items: [
                        {
                            price_data: {
                                currency: 'inr',
                                product_data: {
                                    name: data.packageName,
                                },
                                unit_amount: data.price * 100,
                            },
                            quantity: 1,
                        },
                    ],
                    success_url: `${process.env.CLIENT_URL}/user/success`,
                    cancel_url: `${process.env.CLIENT_URL}/user/cancel`,
                });
                return session.url;
            }
            catch (error) {
                throw new Error('Stripe session creation failed');
            }
        });
    }
}
exports.default = new StripeService();
