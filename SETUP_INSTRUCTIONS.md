# 🚨 PAYMENT INITIALIZATION ERROR - SETUP REQUIRED

## Problem
Your website shows "payment cannot be initialized" because the required Stripe API keys are missing.

## Solution

### Step 1: Create Environment Variables File
Create a file named `.env` in your project root directory with the following content:

```env
# Copy these lines to .env and replace with your actual Stripe keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
PORT=3000
```

### Step 2: Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Sign in or create a Stripe account
3. Copy your keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

### Step 3: Update .env File
Replace the placeholder values in your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_51ABC123...your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...your_actual_publishable_key
PORT=3000
```

### Step 4: Restart Your Server
After creating the `.env` file:
```bash
npm start
```

## ⚠️ Security Note
- Never commit the `.env` file to Git (it's already in `.gitignore`)
- Keep your secret keys private
- Use test keys for development, live keys only for production

## Test vs Live Mode
- **Test mode**: Use `sk_test_` and `pk_test_` keys for development
- **Live mode**: Use `sk_live_` and `pk_live_` keys for production

Once you create the `.env` file with valid Stripe keys, your payment system will work properly! 