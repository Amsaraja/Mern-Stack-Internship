import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create checkout session
router.post("/create-session", auth, async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Plan price mapping
    const planPrices = {
      pro: process.env.STRIPE_PRO_PRICE_ID,
      premium: process.env.STRIPE_PREMIUM_PRICE_ID
    };

    if (!planPrices[plan]) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    // Create or get Stripe customer
    let customerId = user.subscription.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: userId }
      });
      customerId = customer.id;
      
      await User.findByIdAndUpdate(userId, {
        'subscription.stripeCustomerId': customerId
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{
        price: planPrices[plan],
        quantity: 1
      }],
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/subscription?cancelled=true`,
      metadata: {
        userId: userId,
        plan: plan
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Get subscription status
router.get("/subscription", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let subscriptionData = {
      plan: user.subscription.plan,
      status: user.subscription.status,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
      cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd
    };

    // If user has Stripe subscription, get latest data
    if (user.subscription.subscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.subscription.subscriptionId);
        subscriptionData = {
          ...subscriptionData,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        };
      } catch (stripeError) {
        console.error("Stripe subscription fetch error:", stripeError);
      }
    }

    res.json(subscriptionData);
  } catch (error) {
    console.error("Subscription fetch error:", error);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
});

// Cancel subscription
router.post("/cancel", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.subscription.subscriptionId) {
      return res.status(404).json({ error: "No active subscription found" });
    }

    await stripe.subscriptions.update(user.subscription.subscriptionId, {
      cancel_at_period_end: true
    });

    await User.findByIdAndUpdate(req.user.id, {
      'subscription.cancelAtPeriodEnd': true
    });

    res.json({ message: "Subscription will be cancelled at period end" });
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

// Stripe webhook
router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await handleSubscriptionUpdate(subscription, session.metadata.userId);
        }
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.created':
        await handleSubscriptionUpdate(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          await handleSubscriptionUpdate(subscription);
        }
        break;

      case 'invoice.payment_failed':
        // Handle failed payment
        console.log('Payment failed for subscription:', event.data.object.subscription);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper function to handle subscription updates
async function handleSubscriptionUpdate(subscription, userId = null) {
  try {
    let user;
    
    if (userId) {
      user = await User.findById(userId);
    } else {
      const customer = await stripe.customers.retrieve(subscription.customer);
      user = await User.findOne({ 'subscription.stripeCustomerId': customer.id });
    }

    if (!user) {
      console.error('User not found for subscription update');
      return;
    }

    // Determine plan from price ID
    let plan = 'free';
    const priceId = subscription.items.data[0]?.price.id;
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
      plan = 'pro';
    } else if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
      plan = 'premium';
    }

    await User.findByIdAndUpdate(user._id, {
      'subscription.plan': plan,
      'subscription.status': subscription.status === 'active' ? 'active' : 'cancelled',
      'subscription.subscriptionId': subscription.id,
      'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
      'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end
    });

    console.log(`Updated subscription for user ${user.email}: ${plan}`);
  } catch (error) {
    console.error('Error updating subscription:', error);
  }
}

// Helper function to handle subscription cancellation
async function handleSubscriptionCancellation(subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer);
    const user = await User.findOne({ 'subscription.stripeCustomerId': customer.id });

    if (user) {
      await User.findByIdAndUpdate(user._id, {
        'subscription.plan': 'free',
        'subscription.status': 'cancelled',
        'subscription.subscriptionId': null,
        'subscription.currentPeriodEnd': null,
        'subscription.cancelAtPeriodEnd': false
      });

      console.log(`Cancelled subscription for user ${user.email}`);
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

export default router;
