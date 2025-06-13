import Stripe from 'stripe';
import { PaymentData } from '../interface/Packages';

class StripeService {
  private stripe: Stripe;
  constructor() {
     this.stripe = new Stripe(process.env.STRIPE_SECRET as string,{
       apiVersion:'2025-03-31.basil'
     });
  }
  public async createCheckoutSession(data: PaymentData): Promise<string> {
    try {
      const session = await this.stripe.checkout.sessions.create({
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
      return session.url!;
    } catch (error) {
      throw new Error('Stripe session creation failed');
    }
 }
}
export default new StripeService();
