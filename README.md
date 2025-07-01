# 🦑 Hokkaido Meimei - Japanese Travel & Squid Flask Shop

A beautiful Japanese travel planning website with integrated Stripe payments for traditional squid sake flasks.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Stripe

#### Option A: Full Stripe Checkout Integration (Recommended)

1. **Get your Stripe API keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Navigate to Developers > API keys
   - Copy your Publishable key and Secret key

2. **Update the configuration:**
   
   In `index.html`, replace:
   ```javascript
   const stripe = Stripe('pk_test_your_actual_publishable_key_here');
   ```
   
   In `server.js`, replace:
   ```javascript
   const stripe = require('stripe')('sk_test_your_actual_secret_key_here');
   ```

3. **Configure webhook (optional but recommended):**
   - In Stripe Dashboard, go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/webhook`
   - Select event: `checkout.session.completed`
   - Copy the signing secret and update in `server.js`:
   ```javascript
   const endpointSecret = 'whsec_your_webhook_secret_here';
   ```

#### Option B: Simple Payment Links (Easier)

1. **Create Payment Links in Stripe:**
   - Go to Stripe Dashboard > Payment Links
   - Create payment link for "經典魷魚酒壺套組" (¥12,000)
   - Create payment link for "豪華收藏版套組" (¥18,500)

2. **Update the code to use Payment Links:**
   
   In `index.html`, replace the `buyWithStripe` function with:
   ```javascript
   function buyWithStripe(productType) {
       const paymentLinks = {
           'squid-classic': 'https://buy.stripe.com/your-classic-payment-link',
           'squid-deluxe': 'https://buy.stripe.com/your-deluxe-payment-link'
       };
       
       const paymentLink = paymentLinks[productType];
       if (paymentLink) {
           window.open(paymentLink, '_blank');
       } else {
           alert('付款連結設定中，請稍後再試！');
       }
   }
   ```

### 3. Configure Google Forms

Replace the placeholder URLs in the JavaScript functions:

```javascript
// In index.html
function openGoogleForm() {
    window.open('https://forms.google.com/YOUR_ACTUAL_FORM_ID', '_blank');
}

function openBookingForm(type) {
    const formUrls = {
        'cherry-blossom': 'https://forms.google.com/YOUR_CHERRY_BLOSSOM_FORM_ID',
        'hokkaido-winter': 'https://forms.google.com/YOUR_HOKKAIDO_WINTER_FORM_ID',
        'sake-cups': 'https://forms.google.com/YOUR_SAKE_CUPS_FORM_ID'
    };
    window.open(formUrls[type], '_blank');
}
```

### 4. Run the Application

#### For Full Integration:
```bash
npm start
```
Visit: `http://localhost:3000`

#### For Static HTML only:
Simply open `index.html` in your browser (if using Payment Links only)

## 📁 File Structure

```
web-hokkaido-meimei/
├── index.html          # Main website
├── success.html        # Payment success page
├── cancel.html         # Payment cancel page
├── server.js           # Backend server (for full integration)
├── package.json        # Dependencies
└── README.md           # This file
```

## 🛠️ Features

- **Responsive Design**: Works perfectly on mobile and desktop
- **Stripe Integration**: Secure credit card payments
- **Japanese UI**: Traditional Japanese aesthetic with modern UX
- **Travel Planning**: Tour booking functionality
- **Product Showcase**: Beautiful product display for sake flasks
- **Multiple Payment Options**: Credit card + bulk order forms

## 🎨 Customization

### Colors
The website uses a custom color palette defined in Tailwind config:
- `hokkaido-red`: #E53E3E
- `hokkaido-light-red`: #FED7D7
- `hokkaido-pink`: #FBB6CE
- `hokkaido-cream`: #FFFAF0

### Products
To add new products, update the `products` object in `index.html`:

```javascript
const products = {
    'your-product-id': {
        name: 'Product Name',
        description: 'Product Description',
        price: 10000, // in smallest currency unit (e.g., yen)
        currency: 'jpy',
        images: ['https://your-image-url.jpg']
    }
};
```

## 🔧 Environment Variables (Optional)

Create a `.env` file for sensitive data:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
WEBHOOK_SECRET=whsec_your_webhook_secret
```

Then update your code to use `process.env.STRIPE_SECRET_KEY`

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify
1. Push code to GitHub
2. Connect to Netlify
3. Build command: `npm install`
4. Publish directory: `./`

## 📞 Support

If you need help setting up the Stripe integration:

1. Check the [Stripe Documentation](https://stripe.com/docs)
2. Test with Stripe's test card numbers
3. Monitor payments in Stripe Dashboard

## 🎯 Testing

Use Stripe's test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 📝 License

This project is licensed under the MIT License.

---

Made with ❤️ for Japanese travel enthusiasts and sake lovers! 