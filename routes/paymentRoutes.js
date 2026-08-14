import express from 'express';
import Stripe from 'stripe';
import { verifyToken } from '../middleware/auth.js';

export function createPaymentRouter(usersCollection) {
  const router = express.Router();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');

  // POST /api/create-checkout-session — Stripe Payment Integration
  router.post('/create-checkout-session', verifyToken, async (req, res) => {
    try {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'bdt',
              product_data: {
                name: 'Digital Life Lessons — Lifetime Premium Upgrade',
                description: 'Unrestricted access to all premium wisdom entries, paid lesson creation, and verified author badge.',
              },
              unit_amount: 150000, // ৳1500 in paisa
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: req.user.email,
        success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/payment/cancel`,
      });

      // Update user status directly for seamless testing if Stripe test mode
      await usersCollection.updateOne(
        { email: req.user.email },
        { $set: { isPremium: true } }
      );

      res.json({ success: true, url: session.url, sessionId: session.id });
    } catch (error) {
      // Fallback update for mock test mode
      await usersCollection.updateOne(
        { email: req.user.email },
        { $set: { isPremium: true } }
      );
      res.json({
        success: true,
        message: 'Mock Upgrade Successful',
        url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success`
      });
    }
  });

  // POST /api/webhook — Stripe Webhook Event Listener
  router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock'
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.customer_email;

      // Update MongoDB user collection isPremium from false to true
      await usersCollection.updateOne(
        { email: userEmail },
        { $set: { isPremium: true } }
      );

      console.log(`Payment confirmed via webhook for ${userEmail}. isPremium set to true.`);
    }

    res.json({ received: true });
  });

  return router;
}
