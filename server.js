const express = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

// ============================================================================
// 🎯 PRODUCT CONFIGURATION - ONLY EDIT THIS SECTION TO MANAGE PRODUCTS
// ============================================================================
const PRODUCTS = {
    'squid-sake-set': {
        // Stripe Configuration - UPDATE THIS WITH NEW PERSON'S PRODUCT ID
        stripe_id: 'prod_SoF3R9jUVkNpow', // Was: prod_Sa51z8ECdsm5U0
        
        // Display Information
        name: '🦑 魷魚酒壺套組',
        description: '函館漁師傳統工藝 + 精美小酒杯',
        
        // Pricing Configuration
        pricing_type: 'tiered',
        tiers: [
            { up_to: 1, unit_amount: 75000 },    // NT$750 for 1 item
            { up_to: 3, unit_amount: 66000 },    // NT$660 for 2-3 items
            { up_to: 4, unit_amount: 60500 },    // NT$605 for 4 items
            { up_to: 'inf', unit_amount: 55000 } // NT$550 for 5+ items
        ],
        
        // Frontend Display Options
        quantity_options: [1, 2, 3, 4, 5, 10] // Available quick-select quantities
    },
    
    'new-product': {
        // Stripe Configuration - UPDATE THIS WITH NEW PERSON'S PRODUCT ID
        stripe_id: 'prod_SjqOb1WUGOGcDe', // Was: prod_SaveAY7nQYrlxS
        
        // Display Information
        name: '🎌 日本特色商品',
        description: '精選日本特色商品，品質保證',
        
        // Pricing Configuration
        pricing_type: 'tiered',
        tiers: [
            { up_to: 4, unit_amount: 40000 },    // NT$400 for under 5 items
            { up_to: 'inf', unit_amount: 35000 } // NT$350 for 5+ items
        ],
        
        // Frontend Display Options
        quantity_options: [1, 2, 3, 4, 5, 10] // Available quick-select quantities
    },
    
    'tosa-banquet-cup': {
        // Stripe Configuration - UPDATE THIS WITH NEW PERSON'S PRODUCT ID
        stripe_id: 'prod_SjqRV0939fYU9S', // Was: prod_Sg94KTCgj8JXd5
        
        // Display Information
        name: '🍶 高知傳統酒席神器｜土佐宴會杯',
        description: '無法擱置的酒杯，倒酒後不能放桌，只能豪爽喝下去！',
        
        // Pricing Configuration
        pricing_type: 'simple',
        price: 145000,                        // NT$1450 for all quantities
        
        // Frontend Display Options
        quantity_options: [1, 2, 3, 4, 5, 10] // Available quick-select quantities
    }
    
    // 📝 TO ADD NEW PRODUCTS:
    // Just copy the template above and modify the values!
    // Example:
    // 'another-product': {
    //     stripe_id: 'prod_YOUR_STRIPE_ID',
    //     name: '🎁 Another Product',
    //     description: 'Product description',
    //     pricing_type: 'simple',              // or 'tiered'
    //     price: 99900,                        // For simple pricing (NT$999)
    //     quantity_options: [1, 2, 5]          // Quick-select options
    // }
};

// ============================================================================
// 🔧 CORE FUNCTIONS - DON'T EDIT UNLESS YOU KNOW WHAT YOU'RE DOING
// ============================================================================

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Universal pricing calculation function
function calculatePrice(productId, quantity = 1) {
    const product = PRODUCTS[productId];
    if (!product) throw new Error(`Product '${productId}' not found`);

    if (product.pricing_type === 'tiered') {
        // Find the correct tier based on quantity
        const tier = product.tiers.find(t => t.up_to === 'inf' || quantity <= t.up_to);
        const unitPrice = tier?.unit_amount || product.tiers[0].unit_amount;
        
        return {
            unitPrice,
            totalPrice: unitPrice * quantity,
            pricePerUnit: unitPrice / 100,
            totalDisplay: (unitPrice * quantity) / 100
        };
    } else {
        // Simple pricing
        return {
            unitPrice: product.price,
            totalPrice: product.price * quantity,
            pricePerUnit: product.price / 100,
            totalDisplay: (product.price * quantity) / 100
        };
    }
}

// ============================================================================
// 📡 API ENDPOINTS - GENERIC FOR ALL PRODUCTS
// ============================================================================

// Get Stripe publishable key for frontend
app.get('/api/stripe-key', (req, res) => {
    res.json({ 
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY 
    });
});

// Get all products (for frontend to load)
app.get('/api/products', (req, res) => {
    const productsWithPricing = {};
    
    Object.entries(PRODUCTS).forEach(([id, product]) => {
        const pricing1 = calculatePrice(id, 1);
        const pricing5 = calculatePrice(id, 5);
        
        productsWithPricing[id] = {
            ...product,
            pricing_preview: {
                single: pricing1.pricePerUnit,
                bulk: pricing5.pricePerUnit
            }
        };
    });
    
    res.json(productsWithPricing);
});

// Get pricing for specific product and quantity
app.get('/get-pricing/:productId/:quantity', (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.params.quantity) || 1;
        const pricing = calculatePrice(productId, quantity);
        
        res.json({
            productId,
            quantity,
            unitPrice: pricing.pricePerUnit,
            totalPrice: pricing.totalDisplay,
            product: PRODUCTS[productId]
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get quantity options for any product
app.get('/get-pricing-options/:productId', (req, res) => {
    try {
        const productId = req.params.productId;
        const product = PRODUCTS[productId];
        
        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        }
        
        const options = product.quantity_options.map(qty => {
            const pricing = calculatePrice(productId, qty);
            const basePrice = calculatePrice(productId, 1).unitPrice;
            
            return {
                quantity: qty,
                unitPrice: pricing.pricePerUnit,
                totalPrice: pricing.totalDisplay,
                savings: qty > 1 ? ((basePrice - pricing.unitPrice) / 100 * qty).toFixed(0) : 0,
                displayText: `${qty}個 - NT$${pricing.totalDisplay.toLocaleString()}`
            };
        });
        
        res.json(options);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Backward compatibility endpoints (for existing frontend code)
app.get('/get-pricing/:quantity', (req, res) => {
    const quantity = parseInt(req.params.quantity) || 1;
    const pricing = calculatePrice('squid-sake-set', quantity);
    
    res.json({
        quantity: quantity,
        unitPrice: pricing.pricePerUnit,
        totalPrice: pricing.totalDisplay,
        savings: quantity > 1 ? ((75000 - pricing.unitPrice) / 100 * quantity).toFixed(0) : 0
    });
});

app.get('/get-pricing-options', (req, res) => {
    res.redirect('/get-pricing-options/squid-sake-set');
});

app.get('/get-pricing-options-new', (req, res) => {
    res.redirect('/get-pricing-options/new-product');
});

// ============================================================================
// 💳 STRIPE CHECKOUT - UNIVERSAL FOR ALL PRODUCTS
// ============================================================================

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { productId = 'squid-sake-set', quantity = 1, customerNote = '' } = req.body;
        
        const product = PRODUCTS[productId];
        if (!product) {
            return res.status(400).json({ error: 'Product not found' });
        }

        const pricing = calculatePrice(productId, quantity);
        
        console.log(`Creating checkout session: ${product.name} - ${quantity} items at NT$${pricing.pricePerUnit} each`);

        // Get the proper origin URL with fallback
        const origin = req.headers.origin || req.headers.host || 'https://web-hokkaido-meimei.vercel.app';
        const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'twd',
                        product: product.stripe_id, // Use your actual Stripe product ID
                        unit_amount: pricing.unitPrice,
                    },
                    quantity: quantity,
                }
            ],
            mode: 'payment',
            success_url: `${baseUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/cancel.html`,
            shipping_address_collection: {
                allowed_countries: ['TW', 'JP','HK','CN'],
            },
            custom_fields: [
                {
                    key: 'customer_note',
                    label: {
                        type: 'custom',
                        custom: '備註留言 (可選)'
                    },
                    type: 'text',
                    optional: true
                }
            ],
            metadata: {
                product_id: productId,
                product_name: product.name,
                quantity: quantity.toString(),
                unit_price: pricing.pricePerUnit.toString(),
                total_price: pricing.totalDisplay.toString(),
                customer_note: customerNote || ''
            }
        });

        console.log(`✅ Created checkout session ${session.id} for ${product.name}`);
        res.json({ id: session.id });
        
    } catch (error) {
        console.error('❌ Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get checkout session details (for success page)
app.get('/checkout-session/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        res.json(session);
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Test endpoint with minimal Stripe checkout session
app.post('/test-payment', async (req, res) => {
    try {
        console.log('🧪 Testing minimal checkout session...');
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'twd',
                        product_data: {
                            name: 'Test Product',
                        },
                        unit_amount: 50000, // NT$500
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000/cancel.html',
        });

        console.log(`✅ Test session created: ${session.id}`);
        res.json({ 
            success: true,
            session_id: session.id,
            message: 'Test payment session created successfully!' 
        });
        
    } catch (error) {
        console.error('❌ Test payment error:', error.message);
        res.status(500).json({ 
            success: false,
            error: error.message,
            type: error.type || 'unknown_error'
        });
    }
});

// ============================================================================
// 🔍 DEVELOPMENT TOOLS
// ============================================================================

// Helper endpoint to list your Stripe products (for development)
app.get('/list-products', async (req, res) => {
    try {
        const products = await stripe.products.list({ limit: 10 });
        const productList = [];
        
        for (const product of products.data) {
            const prices = await stripe.prices.list({ product: product.id });
            productList.push({
                product_id: product.id,
                name: product.name,
                prices: prices.data.map(price => ({
                    price_id: price.id,
                    amount: price.unit_amount,
                    currency: price.currency
                }))
            });
        }
        
        res.json(productList);
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================================================
// 🪝 WEBHOOK HANDLER
// ============================================================================

app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'whsec_your_webhook_secret_here'; // Replace with your actual webhook secret

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`❌ Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('✅ Payment successful for session:', session.id);
            console.log('📦 Product:', session.metadata?.product_name || 'Unknown');
            console.log('📊 Quantity:', session.metadata?.quantity || '1');
            console.log('💰 Total:', session.metadata?.total_price || 'Unknown');
            console.log('💬 Customer note:', session.metadata?.customer_note || 'No note');
            
            // TODO: Add your post-payment logic here:
            // - Send confirmation email
            // - Update inventory
            // - Create order in database
            // - etc.
            
            break;
        default:
            console.log(`⚠️ Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

// ============================================================================
// 🚀 SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3000;

// For local development
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 Visit http://localhost:${PORT} to view your site`);
        console.log(`📦 Loaded ${Object.keys(PRODUCTS).length} products`);
        
        // Show loaded products
        Object.entries(PRODUCTS).forEach(([id, product]) => {
            console.log(`   • ${product.name} (${id})`);
        });
    });
}

// Export for Vercel
module.exports = app; 