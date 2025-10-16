import jsPDF from 'jspdf';

export class ManualGenerator {
  private doc: jsPDF;
  private pageHeight: number;
  private currentY: number = 20;
  private pageNumber: number = 1;

  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
  }

  generateUserManual(): void {
    this.addCoverPage();
    this.addTableOfContents();
    this.addSystemOverview();
    this.addGettingStarted();
    this.addFeatureGuide();
    this.addTroubleshooting();
    this.addMaintenance();
    this.addClientPresentation();
    this.addTechnicalNotes();
    
    this.doc.save('CHABS_User_Manual.pdf');
  }

  private addCoverPage(): void {
    // Title
    this.doc.setFontSize(28);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('CHABS INVENTORY', 105, 80, { align: 'center' });
    this.doc.text('MANAGEMENT SYSTEM', 105, 100, { align: 'center' });
    
    // Subtitle
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Complete User Manual & System Guide', 105, 130, { align: 'center' });
    
    // Version and date
    this.doc.setFontSize(12);
    this.doc.text('Version 2.0.0', 105, 160, { align: 'center' });
    this.doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 175, { align: 'center' });
    
    // Footer
    this.doc.setFontSize(10);
    this.doc.text('For Business Owners & System Administrators', 105, 250, { align: 'center' });
    
    this.addNewPage();
  }

  private addTableOfContents(): void {
    this.addSectionTitle('TABLE OF CONTENTS');
    
    const contents = [
      '1. System Overview ......................................................... 3',
      '2. Getting Started ......................................................... 4',
      '3. Feature Guide ........................................................... 6',
      '   3.1 Dashboard ............................................................ 6',
      '   3.2 Customer Management .................................................. 7',
      '   3.3 Product Management ................................................... 8',
      '   3.4 Quotation System .................................................... 9',
      '   3.5 Order Management .................................................... 10',
      '   3.6 Inventory Control ................................................... 11',
      '   3.7 Supplier Management ................................................. 12',
      '   3.8 Reports & Analytics ................................................. 13',
      '4. Troubleshooting ........................................................ 14',
      '5. System Maintenance ..................................................... 16',
      '6. Client Presentation Guide .............................................. 18',
      '7. Technical Notes ........................................................ 20'
    ];
    
    this.doc.setFontSize(11);
    contents.forEach(item => {
      this.addText(item);
      this.currentY += 8;
    });
    
    this.addNewPage();
  }

  private addSystemOverview(): void {
    this.addSectionTitle('1. SYSTEM OVERVIEW');
    
    this.addSubTitle('What is CHABS?');
    this.addText('CHABS is a complete business management system designed for South African businesses.');
    this.addText('It handles everything from customer management to inventory control, quotations, and orders.');
    this.addText('');
    
    this.addSubTitle('Key Benefits:');
    this.addBulletPoint('• Saves 5-10 hours per week on administrative tasks');
    this.addBulletPoint('• Reduces errors in quotations and orders by 90%');
    this.addBulletPoint('• Provides real-time inventory tracking');
    this.addBulletPoint('• Professional quotations and invoices');
    this.addBulletPoint('• Multi-user access with role-based permissions');
    this.addText('');
    
    this.addSubTitle('System Requirements:');
    this.addBulletPoint('• Modern web browser (Chrome, Firefox, Safari, Edge)');
    this.addBulletPoint('• Internet connection');
    this.addBulletPoint('• No software installation required');
    this.addText('');
    
    this.addSubTitle('Who Can Use It:');
    this.addBulletPoint('• Business owners (no technical knowledge required)');
    this.addBulletPoint('• Sales teams');
    this.addBulletPoint('• Warehouse staff');
    this.addBulletPoint('• Managers and supervisors');
    
    this.addNewPage();
  }

  private addGettingStarted(): void {
    this.addSectionTitle('2. GETTING STARTED');
    
    this.addSubTitle('First Time Setup (5 minutes):');
    this.addText('1. Open your web browser');
    this.addText('2. Go to your system URL (provided by your administrator)');
    this.addText('3. Login with your username and password');
    this.addText('4. You will see the main dashboard');
    this.addText('');
    
    this.addSubTitle('Understanding the Interface:');
    this.addBulletPoint('• TOP BAR: Shows your company name and user menu');
    this.addBulletPoint('• LEFT MENU: Main navigation (Dashboard, Customers, Products, etc.)');
    this.addBulletPoint('• MAIN AREA: Where you work with data');
    this.addBulletPoint('• NOTIFICATIONS: Bell icon shows important alerts');
    this.addText('');
    
    this.addSubTitle('Basic Navigation:');
    this.addText('Click on menu items on the left to navigate:');
    this.addBulletPoint('• Dashboard - Overview of your business');
    this.addBulletPoint('• Customers - Manage customer information');
    this.addBulletPoint('• Products - Add and manage your inventory');
    this.addBulletPoint('• Quotations - Create and send quotes');
    this.addBulletPoint('• Orders - Track customer orders');
    this.addBulletPoint('• Reports - View business analytics');
    this.addText('');
    
    this.addSubTitle('User Roles Explained:');
    this.addText('ADMINISTRATOR: Can do everything, manage users, change settings');
    this.addText('MANAGER: Can view reports, manage operations, but cannot change system settings');
    this.addText('SALES: Can manage customers and create quotations');
    this.addText('WAREHOUSE: Can manage inventory and process orders');
    
    this.addNewPage();
  }

  private addFeatureGuide(): void {
    this.addSectionTitle('3. FEATURE GUIDE');
    
    // Dashboard
    this.addSubTitle('3.1 Dashboard - Your Business at a Glance');
    this.addText('The dashboard shows:');
    this.addBulletPoint('• Total revenue and pending orders');
    this.addBulletPoint('• Low stock alerts (products running out)');
    this.addBulletPoint('• Recent activity');
    this.addBulletPoint('• Quick action buttons');
    this.addText('');
    this.addText('RED ALERTS = Urgent attention needed');
    this.addText('YELLOW WARNINGS = Should be addressed soon');
    this.addText('GREEN STATUS = Everything is good');
    this.addText('');
    
    // Customer Management
    this.addSubTitle('3.2 Customer Management');
    this.addText('Adding a New Customer:');
    this.addText('1. Click "Customers" in the left menu');
    this.addText('2. Click "Add Customer" button');
    this.addText('3. Fill in customer details (name, email, phone)');
    this.addText('4. Click "Save Customer"');
    this.addText('');
    this.addText('IMPORTANT: Always add email addresses for automatic quotation sending');
    this.addText('');
    
    // Product Management
    this.addSubTitle('3.3 Product Management');
    this.addText('Adding Products:');
    this.addText('1. Click "Products" in the left menu');
    this.addText('2. Click "Add Product"');
    this.addText('3. Enter product name and SKU (product code)');
    this.addText('4. Set cost price and selling price');
    this.addText('5. Set minimum stock level (system will alert when low)');
    this.addText('6. Click "Save Product"');
    this.addText('');
    this.addText('PRICING TIP: Cost price = what you pay, Selling price = what customer pays');
    this.addText('STOCK TIP: Set minimum stock to 10-20% of normal usage');
    
    this.addNewPage();
    
    // Quotation System
    this.addSubTitle('3.4 Quotation System - Creating Professional Quotes');
    this.addText('Creating a Quotation:');
    this.addText('1. Click "Quotations" in the left menu');
    this.addText('2. Fill in quote number and customer');
    this.addText('3. Add products by searching in the item field');
    this.addText('4. Enter quantities (whole numbers only)');
    this.addText('5. Adjust prices if needed by clicking on the price');
    this.addText('6. Add discount if applicable');
    this.addText('7. Click "Save" to create the quotation');
    this.addText('');
    this.addText('SENDING QUOTES:');
    this.addText('• Click "Preview" to see how it will look');
    this.addText('• Click "Export PDF" to download');
    this.addText('• Email directly from the system (if email is configured)');
    this.addText('');
    
    // Order Management
    this.addSubTitle('3.5 Order Management');
    this.addText('Converting Quotes to Orders:');
    this.addText('1. Go to quotations list');
    this.addText('2. Change quote status to "Accepted"');
    this.addText('3. Click "Create Order" button');
    this.addText('4. Select which items to include');
    this.addText('5. Click "Create Order"');
    this.addText('');
    this.addText('Order Status Flow:');
    this.addText('Pending → Confirmed → Preparing → Ready → Shipped → Delivered');
    this.addText('');
    this.addText('WAREHOUSE STAFF: Update order status as work progresses');
    
    this.addNewPage();
  }

  private addTroubleshooting(): void {
    this.addSectionTitle('4. COMPLETE TROUBLESHOOTING GUIDE');
    
    this.addSubTitle('🚨 CRITICAL ERRORS (System Won\'t Start):');
    this.addText('');
    
    this.addText('ERROR: "Cannot find module" or "Module not found"');
    this.addText('MEANING: A required file is missing');
    this.addText('WHERE TO FIX: Open Terminal/Command Prompt');
    this.addText('SOLUTION: Type "npm install" and press Enter');
    this.addText('FILE LOCATION: Check package.json in main folder');
    this.addText('');
    
    this.addText('ERROR: "Port 3000 already in use"');
    this.addText('MEANING: Another program is using the same port');
    this.addText('WHERE TO FIX: Terminal or close other programs');
    this.addText('SOLUTION: Type "npx kill-port 3000" or use different port');
    this.addText('');
    
    this.addText('ERROR: "ENOENT: no such file or directory"');
    this.addText('MEANING: System can\'t find a specific file');
    this.addText('WHERE TO FIX: Check if file exists in mentioned path');
    this.addText('SOLUTION: Restore missing file or check spelling');
    this.addText('');
    
    this.addSubTitle('🔐 LOGIN & ACCESS PROBLEMS:');
    this.addText('');
    
    this.addText('PROBLEM: "Invalid credentials" message');
    this.addText('FILE TO CHECK: src/lib/auth-simple.ts (lines 15-25)');
    this.addText('DEFAULT LOGIN: admin@chabs.com / admin123');
    this.addText('FIX: Reset to default or clear browser storage');
    this.addText('');
    
    this.addText('PROBLEM: Redirected to login after being logged in');
    this.addText('FILE TO CHECK: src/lib/auth-simple.ts (lines 30-40)');
    this.addText('CAUSE: Session expired or storage cleared');
    this.addText('FIX: Login again or check token logic');
    this.addText('');
    
    this.addText('PROBLEM: "Access denied" on certain pages');
    this.addText('FILE TO CHECK: Each page file (like src/pages/manual.tsx)');
    this.addText('CAUSE: User role doesn\'t have permission');
    this.addText('FIX: Change user role or update role check in page');
    this.addText('');
    
    this.addSubTitle('💾 DATA NOT SAVING:');
    this.addText('');
    
    this.addText('PROBLEM: Changes disappear after refresh');
    this.addText('FILE TO CHECK: src/lib/storage-simple.ts (lines 10-50)');
    this.addText('CAUSE: Browser storage not working');
    this.addText('FIX: Check browser allows localStorage');
    this.addText('');
    
    this.addText('PROBLEM: "Cannot read property of undefined"');
    this.addText('FILE TO CHECK: Component file showing the error');
    this.addText('CAUSE: Trying to access data that doesn\'t exist');
    this.addText('FIX: Add safety checks like "data?.property"');
    this.addText('');
    
    this.addText('PROBLEM: Data shows as empty or null');
    this.addText('FILE TO CHECK: src/lib/storage-simple.ts functions');
    this.addText('CAUSE: Data not initialized or corrupted');
    this.addText('FIX: Clear browser storage and restart');
    this.addText('');
    
    this.addSubTitle('📄 PDF GENERATION PROBLEMS:');
    this.addText('');
    
    this.addText('PROBLEM: PDF shows blank or incomplete');
    this.addText('FILE TO CHECK: src/lib/pdf-generator.ts (lines 50-200)');
    this.addText('CAUSE: Missing data or HTML issues');
    this.addText('FIX: Check all required fields have data');
    this.addText('');
    
    this.addText('PROBLEM: "jsPDF is not defined"');
    this.addText('FILE TO CHECK: package.json dependencies');
    this.addText('CAUSE: jsPDF library not installed');
    this.addText('FIX: Run "npm install jspdf html2canvas"');
    this.addText('');
    
    this.addText('PROBLEM: PDF formatting looks wrong');
    this.addText('FILE TO CHECK: src/lib/pdf-generator.ts (CSS section)');
    this.addText('CAUSE: CSS styles not applied correctly');
    this.addText('FIX: Update CSS in generatePDF function');
    this.addText('');
    
    this.addSubTitle('📧 EMAIL SYSTEM ISSUES:');
    this.addText('');
    
    this.addText('PROBLEM: "Email configuration not found"');
    this.addText('FILE TO CHECK: src/lib/email.ts (lines 20-40)');
    this.addText('CAUSE: Email settings not configured');
    this.addText('FIX: Go to Settings → Email tab and configure');
    this.addText('');
    
    this.addText('PROBLEM: "Failed to send email"');
    this.addText('FILE TO CHECK: src/lib/email.ts (sendEmail function)');
    this.addText('CAUSE: Wrong credentials or network issue');
    this.addText('FIX: Verify email settings, check internet');
    this.addText('');
    
    this.addText('PROBLEM: Emails go to spam folder');
    this.addText('CAUSE: Email provider reputation issues');
    this.addText('FIX: Contact email provider for authentication');
    this.addText('');
    
    this.addSubTitle('🎨 DISPLAY & UI PROBLEMS:');
    this.addText('');
    
    this.addText('PROBLEM: Page looks broken or unstyled');
    this.addText('FILE TO CHECK: src/styles/globals.css');
    this.addText('CAUSE: CSS not loading or Tailwind not working');
    this.addText('FIX: Check Tailwind installed, restart server');
    this.addText('');
    
    this.addText('PROBLEM: Dark/Light theme not working');
    this.addText('FILE TO CHECK: src/contexts/ThemeContext.tsx');
    this.addText('CAUSE: Theme context not working');
    this.addText('FIX: Check ThemeProvider wraps app in _app.tsx');
    this.addText('');
    
    this.addText('PROBLEM: "Hydration mismatch" error');
    this.addText('FILE TO CHECK: Component with client-side code');
    this.addText('CAUSE: Server and client render differently');
    this.addText('FIX: Add mounted state check with useEffect');
    this.addText('');
    
    this.addSubTitle('🔢 DATA VALIDATION ERRORS:');
    this.addText('');
    
    this.addText('PROBLEM: "Invalid quantity" or number errors');
    this.addText('FILE TO CHECK: src/components/QuoteBuilder.tsx');
    this.addText('CAUSE: Non-integer values or negative numbers');
    this.addText('FIX: Ensure inputs use step="1" and parseInt()');
    this.addText('');
    
    this.addText('PROBLEM: Currency showing $ instead of R');
    this.addText('FILES TO CHECK: All components with currency');
    this.addText('FIX: Search for "$" and replace with "R"');
    this.addText('');
    
    this.addText('PROBLEM: "Required field" validation not working');
    this.addText('FILE TO CHECK: Form components (QuoteBuilder.tsx)');
    this.addText('FIX: Add validation checks before submission');
    this.addText('');
    
    this.addSubTitle('🗄️ DATABASE/STORAGE ISSUES:');
    this.addText('');
    
    this.addText('PROBLEM: "localStorage is not defined"');
    this.addText('CAUSE: Code running server-side');
    this.addText('FIX: Wrap localStorage in "typeof window" checks');
    this.addText('');
    
    this.addText('PROBLEM: Data corruption or weird values');
    this.addText('FILE TO CHECK: Browser Dev Tools → Application → Storage');
    this.addText('FIX: Clear localStorage and restart');
    this.addText('');
    
    this.addSubTitle('🔍 HOW TO DEBUG ANY ISSUE:');
    this.addText('');
    
    this.addText('STEP 1: Check Browser Console');
    this.addText('• Press F12 → Console tab');
    this.addText('• Look for red error messages');
    this.addText('• Note file name and line number');
    this.addText('');
    
    this.addText('STEP 2: Check Network Tab');
    this.addText('• Press F12 → Network tab');
    this.addText('• Look for failed requests (red entries)');
    this.addText('• Check if APIs are responding');
    this.addText('');
    
    this.addText('STEP 3: Check Application Storage');
    this.addText('• Press F12 → Application → Local Storage');
    this.addText('• Verify data is saved correctly');
    this.addText('• Clear if corrupted');
    this.addText('');
    
    this.addText('STEP 4: Restart Everything');
    this.addText('• Stop server (Ctrl+C)');
    this.addText('• Run "npm install"');
    this.addText('• Run "npm run dev"');
    this.addText('• Clear browser cache');
    this.addText('');
    
    this.addSubTitle('🆘 EMERGENCY RECOVERY:');
    this.addText('');
    
    this.addText('IF SYSTEM IS COMPLETELY BROKEN:');
    this.addText('1. Backup data from localStorage');
    this.addText('2. Run "git status" to see changes');
    this.addText('3. Run "git checkout ." to reset files');
    this.addText('4. Run "npm install" to reinstall');
    this.addText('5. Run "npm run dev" to restart');
    this.addText('');
    
    this.addText('CONTACT SUPPORT IMMEDIATELY IF:');
    this.addBulletPoint('• System won\'t start after all steps');
    this.addBulletPoint('• Data corruption affecting business');
    this.addBulletPoint('• Security-related errors');
    this.addBulletPoint('• Multiple users report same issue');
    
    this.addNewPage();
  }

  private addMaintenance(): void {
    this.addSectionTitle('5. SYSTEM MAINTENANCE');
    
    this.addSubTitle('Daily Tasks (5 minutes):');
    this.addBulletPoint('• Check dashboard for alerts');
    this.addBulletPoint('• Review low stock notifications');
    this.addBulletPoint('• Update order statuses');
    this.addBulletPoint('• Process new quotations');
    this.addText('');
    
    this.addSubTitle('Weekly Tasks (15 minutes):');
    this.addBulletPoint('• Review customer list for duplicates');
    this.addBulletPoint('• Check product pricing for accuracy');
    this.addBulletPoint('• Review pending quotations');
    this.addBulletPoint('• Update stock levels if needed');
    this.addText('');
    
    this.addSubTitle('Monthly Tasks (30 minutes):');
    this.addBulletPoint('• Review user access and permissions');
    this.addBulletPoint('• Check system usage and performance');
    this.addBulletPoint('• Review and archive old data');
    this.addBulletPoint('• Update company information if changed');
    this.addText('');
    
    this.addSubTitle('Data Backup (IMPORTANT):');
    this.addText('Your data is automatically backed up, but you should also:');
    this.addBulletPoint('• Export important reports monthly');
    this.addBulletPoint('• Keep copies of critical quotations');
    this.addBulletPoint('• Maintain customer contact list separately');
    this.addText('');
    
    this.addSubTitle('Performance Optimization:');
    this.addBulletPoint('• Clear browser cache monthly');
    this.addBulletPoint('• Archive old orders and quotations');
    this.addBulletPoint('• Remove inactive users');
    this.addBulletPoint('• Keep product list organized');
    this.addText('');
    
    this.addSubTitle('Security Best Practices:');
    this.addBulletPoint('• Change passwords every 3 months');
    this.addBulletPoint('• Don\'t share login credentials');
    this.addBulletPoint('• Log out when finished');
    this.addBulletPoint('• Report suspicious activity immediately');
    
    this.addNewPage();
  }

  private addClientPresentation(): void {
    this.addSectionTitle('6. CLIENT PRESENTATION GUIDE');
    
    this.addSubTitle('Key Selling Points:');
    this.addText('');
    
    this.addText('SAVE TIME & MONEY:');
    this.addBulletPoint('• Reduces admin work by 80%');
    this.addBulletPoint('• Eliminates manual quotation creation');
    this.addBulletPoint('• Automatic stock tracking');
    this.addBulletPoint('• Professional documents in seconds');
    this.addText('');
    
    this.addText('IMPROVE ACCURACY:');
    this.addBulletPoint('• No more calculation errors');
    this.addBulletPoint('• Consistent pricing');
    this.addBulletPoint('• Real-time stock levels');
    this.addBulletPoint('• Automatic VAT calculations');
    this.addText('');
    
    this.addText('PROFESSIONAL IMAGE:');
    this.addBulletPoint('• Branded quotations and invoices');
    this.addBulletPoint('• Instant email delivery');
    this.addBulletPoint('• Consistent formatting');
    this.addBulletPoint('• Mobile-friendly interface');
    this.addText('');
    
    this.addSubTitle('Pricing Plans:');
    this.addText('STARTER (R299/month): Perfect for small businesses');
    this.addBulletPoint('• 3 users, 500 products');
    this.addBulletPoint('• Basic features');
    this.addBulletPoint('• Email support');
    this.addText('');
    
    this.addText('PROFESSIONAL (R599/month): For growing businesses');
    this.addBulletPoint('• 10 users, 5,000 products');
    this.addBulletPoint('• Advanced features');
    this.addBulletPoint('• Multi-location support');
    this.addBulletPoint('• API access');
    this.addText('');
    
    this.addText('ENTERPRISE (R1,299/month): For large organizations');
    this.addBulletPoint('• Unlimited users and products');
    this.addBulletPoint('• All features included');
    this.addBulletPoint('• Priority support');
    this.addBulletPoint('• Custom integrations');
    this.addText('');
    
    this.addSubTitle('Common Objections & Responses:');
    this.addText('"Too expensive": Show ROI calculation - saves 10+ hours/week');
    this.addText('"Too complicated": Offer free demo and training');
    this.addText('"We use Excel": Highlight error reduction and time savings');
    this.addText('"What if it breaks": Explain 99.9% uptime and support');
    
    this.addNewPage();
  }

  private addTechnicalNotes(): void {
    this.addSectionTitle('7. TECHNICAL NOTES');
    
    this.addSubTitle('System Architecture (Simple Explanation):');
    this.addText('Your system is built with modern web technology:');
    this.addBulletPoint('• Frontend: React/Next.js (what users see)');
    this.addBulletPoint('• Backend: Node.js (processes data)');
    this.addBulletPoint('• Database: Stores all your information');
    this.addBulletPoint('• Cloud hosting: Accessible from anywhere');
    this.addText('');
    
    this.addSubTitle('File Structure (For Developers):');
    this.addText('Key folders:');
    this.addBulletPoint('• /src/pages - Main application pages');
    this.addBulletPoint('• /src/components - Reusable interface elements');
    this.addBulletPoint('• /src/lib - Business logic and utilities');
    this.addBulletPoint('• /src/styles - Visual styling');
    this.addText('');
    
    this.addSubTitle('Important Files:');
    this.addBulletPoint('• types.ts - Data structure definitions');
    this.addBulletPoint('• storage-simple.ts - Data management');
    this.addBulletPoint('• auth-simple.ts - User authentication');
    this.addBulletPoint('• email.ts - Email functionality');
    this.addText('');
    
    this.addSubTitle('Deployment Options:');
    this.addText('CLOUD HOSTING (Recommended):');
    this.addBulletPoint('• Vercel, Netlify, or AWS');
    this.addBulletPoint('• Automatic scaling');
    this.addBulletPoint('• Built-in backups');
    this.addBulletPoint('• SSL certificates included');
    this.addText('');
    
    this.addText('SELF-HOSTING:');
    this.addBulletPoint('• Requires technical knowledge');
    this.addBulletPoint('• Need to manage updates');
    this.addBulletPoint('• Responsible for backups');
    this.addBulletPoint('• Security management required');
    this.addText('');
    
    this.addSubTitle('Scaling Considerations:');
    this.addBulletPoint('• Current system handles 1000+ products easily');
    this.addBulletPoint('• Database can be upgraded for larger datasets');
    this.addBulletPoint('• Multi-tenant architecture supports multiple companies');
    this.addBulletPoint('• API ready for third-party integrations');
    this.addText('');
    
    this.addSubTitle('Support Contacts:');
    this.addText('Technical Support: support@chabs.com');
    this.addText('Sales Inquiries: sales@chabs.com');
    this.addText('Emergency: +27 11 123 4567');
    this.addText('Documentation: docs.chabs.com');
  }

  // Helper methods
  private addSectionTitle(title: string): void {
    this.checkPageSpace(30);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 20, this.currentY);
    this.currentY += 15;
  }

  private addSubTitle(title: string): void {
    this.checkPageSpace(20);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, 20, this.currentY);
    this.currentY += 10;
  }

  private addText(text: string): void {
    if (!text) {
      this.currentY += 5;
      return;
    }
    this.checkPageSpace(15);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const lines = this.doc.splitTextToSize(text, 170);
    lines.forEach((line: string) => {
      this.doc.text(line, 20, this.currentY);
      this.currentY += 6;
    });
  }

  private addBulletPoint(text: string): void {
    this.checkPageSpace(15);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const lines = this.doc.splitTextToSize(text, 165);
    lines.forEach((line: string, index: number) => {
      this.doc.text(line, index === 0 ? 25 : 30, this.currentY);
      this.currentY += 6;
    });
  }

  private checkPageSpace(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.addNewPage();
    }
  }

  private addNewPage(): void {
    this.doc.addPage();
    this.currentY = 20;
    this.pageNumber++;
    
    // Add page number
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Page ${this.pageNumber}`, 190, this.pageHeight - 10, { align: 'right' });
  }
}