import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const stripe = new Stripe(process.env.STRIPE_JS_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
}); // Initialize Stripe with secret key


export default stripe;
