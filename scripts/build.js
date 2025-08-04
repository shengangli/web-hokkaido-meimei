const fs = require('fs');
const path = require('path');

// Load configuration
const config = JSON.parse(fs.readFileSync('./config/business-config.json', 'utf8'));

// Template replacement function
function replaceTemplate(content, config) {
    // Business name replacements
    content = content.replace(/{{BUSINESS_NAME_JAPANESE}}/g, config.business.name.japanese);
    content = content.replace(/{{BUSINESS_NAME_BRAND}}/g, config.business.name.brand);
    content = content.replace(/{{BUSINESS_NAME_SHORT}}/g, config.business.name.short);
    
    // Contact information
    content = content.replace(/{{CONTACT_EMAIL}}/g, config.business.contact.email);
    content = content.replace(/{{BUSINESS_HOURS_JP}}/g, config.business.contact.businessHours.japanese);
    content = content.replace(/{{BUSINESS_HOURS_ZH}}/g, config.business.contact.businessHours.chinese);
    content = content.replace(/{{OFF_DAYS_JP}}/g, config.business.contact.offDays.japanese);
    content = content.replace(/{{OFF_DAYS_ZH}}/g, config.business.contact.offDays.chinese);
    
    // Location information
    content = content.replace(/{{LOCATION_JAPANESE}}/g, config.business.location.japanese);
    content = content.replace(/{{LOCATION_CHINESE}}/g, config.business.location.chinese);
    content = content.replace(/{{LOCATION_FULL}}/g, config.business.location.full);
    
    // Responsible person
    content = content.replace(/{{RESPONSIBLE_JAPANESE}}/g, config.business.responsible.japanese);
    content = content.replace(/{{RESPONSIBLE_CHINESE}}/g, config.business.responsible.chinese);
    
    // Legal information
    content = content.replace(/{{LAST_UPDATED}}/g, config.business.legal.lastUpdated);
    content = content.replace(/{{COPYRIGHT}}/g, config.business.legal.copyright);
    
    // Policies
    content = content.replace(/{{SHIPPING_POLICY_JP}}/g, config.business.policies.shipping.japanese);
    content = content.replace(/{{SHIPPING_POLICY_ZH}}/g, config.business.policies.shipping.chinese);
    content = content.replace(/{{RETURN_POLICY_JP}}/g, config.business.policies.returnPolicy.japanese);
    content = content.replace(/{{RETURN_POLICY_ZH}}/g, config.business.policies.returnPolicy.chinese);
    content = content.replace(/{{PAYMENT_METHODS_JP}}/g, config.business.policies.paymentMethods.japanese);
    content = content.replace(/{{PAYMENT_METHODS_ZH}}/g, config.business.policies.paymentMethods.chinese);
    
    // Response times
    content = content.replace(/{{RESPONSE_TIME_GENERAL_JP}}/g, config.business.responseTime.general.japanese);
    content = content.replace(/{{RESPONSE_TIME_GENERAL_ZH}}/g, config.business.responseTime.general.chinese);
    content = content.replace(/{{RESPONSE_TIME_URGENT_JP}}/g, config.business.responseTime.urgent.japanese);
    content = content.replace(/{{RESPONSE_TIME_URGENT_ZH}}/g, config.business.responseTime.urgent.chinese);
    content = content.replace(/{{RESPONSE_TIME_PLANNING_JP}}/g, config.business.responseTime.planning.japanese);
    content = content.replace(/{{RESPONSE_TIME_PLANNING_ZH}}/g, config.business.responseTime.planning.chinese);
    
    return content;
}

// Create output directory if it doesn't exist
if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
}

// Process template files
const templateDir = './templates';
const outputDir = './dist';

if (fs.existsSync(templateDir)) {
    const files = fs.readdirSync(templateDir);
    
    files.forEach(file => {
        if (file.endsWith('.html')) {
            console.log(`Processing template: ${file}`);
            
            const templatePath = path.join(templateDir, file);
            const templateContent = fs.readFileSync(templatePath, 'utf8');
            
            const processedContent = replaceTemplate(templateContent, config);
            
            const outputPath = path.join(outputDir, file);
            fs.writeFileSync(outputPath, processedContent);
            
            console.log(`Generated: ${outputPath}`);
        }
    });
    
    console.log('\n✅ Build completed successfully!');
    console.log('📂 Generated files are in the ./dist directory');
    console.log('🔧 To update business information, edit ./config/business-config.json and run this script again');
} else {
    console.log('❌ Templates directory not found. Please create ./templates directory with your template files.');
} 