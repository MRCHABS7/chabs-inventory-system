# 📦 CHABS Inventory Management System

A comprehensive business management system built with Next.js, TypeScript, and Tailwind CSS. Now featuring advanced email integration, external supplier management, enhanced warehouse operations, and a modern dark/light theme system.

## 🚀 Latest Features (v2.0.0)

### 📧 Email Integration
- **Professional Email Templates**: Beautiful HTML email templates for quotations, orders, and purchase orders
- **Multiple Email Providers**: Support for SMTP, SendGrid, and Mailgun
- **Automated Email Sending**: Send quotations directly from the system
- **Email Tracking**: Track sent emails with timestamps and delivery status
- **Test Email Functionality**: Built-in email testing to verify configuration

### 🏭 External Supplier Management
- **External Processing Services**: Manage suppliers who provide processing services (painting, coating, assembly)
- **Process Cost Tracking**: Track costs and lead times for external processes

- **Process Integration**: Link external processes to products in your BOM

### 🏪 Enhanced Warehouse Management
- **Advanced Stock Tracking**: Comprehensive stock movement history with reasons and references
- **Location Management**: Organize inventory by warehouse locations with capacity tracking
- **Order Picking Lists**: Generate picking lists for warehouse staff with location information
- **Stock Alerts**: Real-time low stock and overstock alerts
- **Movement Types**: Track stock in, out, and adjustments with full audit trail

### 🎨 Modern Theme System
- **Dark/Light/Auto Modes**: Beautiful purple and pink gradient theme that adapts to system preferences
- **Theme Persistence**: User theme preferences saved across sessions
- **Enhanced Accessibility**: Improved contrast and readability in all modes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## ✨ Core Features

### Business Management
- **Customer Management**: Complete customer database with contact information, credit limits, and payment terms
- **Product Management**: Inventory tracking with SKU, pricing, stock levels, and categories
- **Quotation System**: Professional quote generation with PDF export and email capabilities
- **Order Management**: Convert quotes to orders with status tracking and delivery management
- **Supplier Management**: Supplier database with ratings and contact information
- **Purchase Order System**: Automated purchase order generation and tracking

### Advanced Features
- **Bill of Materials (BOM)**: Multi-level product assembly tracking
- **Stock Movement Tracking**: Complete audit trail of inventory changes
- **Automated Reordering**: Smart purchase order generation based on stock levels
- **Profit Analysis**: Real-time profit margin calculations and supplier price comparisons
- **Business Insights**: Demand forecasting and inventory optimization recommendations
- **Multi-User Support**: Role-based access control (Admin, Sales, Warehouse, Manager)
- **Email Integration**: Professional email templates and automated sending
- **External Processing**: Manage external suppliers and processing services

## 🚀 Tech Stack

- **Frontend**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS with custom components and dark/light theme support
- **State Management**: React hooks and local storage
- **PDF Generation**: jsPDF for quotation and report exports
- **Email Service**: Multi-provider email support (SMTP, SendGrid, Mailgun)
- **Authentication**: Simple JWT-based authentication system
- **Data Storage**: Local storage with JSON serialization (easily replaceable with database)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chabs-inventory
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login
- **Email**: admin@chabs.com
- **Password**: admin123

## 📧 Email Configuration

### SMTP Setup (Gmail Example)
1. Go to Settings → Email tab
2. Select "SMTP (Custom)" as provider
3. Configure:
   - SMTP Host: `smtp.gmail.com`
   - SMTP Port: `587`
   - Username: Your Gmail address
   - Password: App password (not regular password)

### SendGrid Setup
1. Sign up at sendgrid.com
2. Create API key with "Mail Send" permissions
3. Configure in Settings → Email tab

### Mailgun Setup
1. Sign up at mailgun.com
2. Add and verify your domain
3. Get API key and domain from dashboard
4. Configure in Settings → Email tab

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navigation.tsx  # Navigation bar
│   ├── Dashboard.tsx   # Dashboard overview
│   ├── QuoteBuilder.tsx # Quotation creation form
│   ├── EmailSettings.tsx # Email configuration
│   ├── ExternalSupplierManager.tsx # External supplier management
│   ├── WarehouseManager.tsx # Warehouse operations
│   └── ...
├── pages/              # Next.js pages
│   ├── index.tsx       # Landing page
│   ├── dashboard.tsx   # Main dashboard
│   ├── customers.tsx   # Customer management
│   ├── products.tsx    # Product management
│   ├── external-suppliers.tsx # External supplier management
│   └── ...
├── lib/                # Utility functions and types
│   ├── types.ts        # TypeScript type definitions
│   ├── storage-simple.ts # Data storage functions
│   ├── email.ts        # Email service functions
│   ├── auth-simple.ts  # Authentication utilities
│   └── ...
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Theme management
└── styles/             # CSS and styling
    └── globals.css     # Global styles with dark/light theme support
```

## 🔧 Key Components

### Customer Management
- Add, edit, and delete customers
- Track contact information and payment terms
- Credit limit monitoring
- Customer order history

### Product Management  
- SKU-based inventory tracking
- Multi-level Bill of Materials (BOM)
- Cost and selling price management
- Stock level monitoring with min/max thresholds
- Category organization
- External processing integration

### Quotation System
- Drag-and-drop quote builder
- Professional PDF generation
- **NEW**: Email integration with beautiful templates
- Quote-to-order conversion
- Validity period tracking
- Custom quote numbering

### Order Management
- Order status tracking (Pending → Confirmed → Preparing → Ready → Shipped → Delivered)
- Priority levels (Low, Medium, High, Urgent)
- Delivery date tracking
- Order fulfillment workflow
- **NEW**: Email notifications for order updates

### Warehouse Management
- **NEW**: Advanced location management with capacity tracking
- **NEW**: Order picking lists with location information
- Real-time stock levels
- Stock movement tracking with full audit trail
- **NEW**: Enhanced stock alerts and notifications
- **NEW**: Movement categorization (In, Out, Adjustment)

### External Supplier Management
- **NEW**: Manage external processing suppliers
- **NEW**: Track processing costs and lead times
- **NEW**: Supplier rating and performance tracking
- **NEW**: Process type categorization
- **NEW**: Integration with product BOM

### Purchase Order System
- Automated PO generation
- Supplier integration
- Delivery tracking
- Partial receipt handling
- **NEW**: Email PO sending to suppliers

### Automation
- Demand forecasting
- Automated reorder points
- Price optimization suggestions
- Supplier performance analysis
- Inventory optimization recommendations

## 🎨 Theme Customization

The system includes a modern theme system with:
- **Light Mode**: Clean, professional appearance
- **Dark Mode**: Easy on the eyes with purple/pink accents
- **Auto Mode**: Follows system preferences
- **Persistent Settings**: Theme choice saved per user

### Customizing Colors
Modify the CSS variables in `src/styles/globals.css`:
```css
:root {
  --primary-color: #8B5CF6;
  --secondary-color: #EC4899;
  /* Add your custom colors */
}
```

## ⚙️ Customization

### Adding New Fields
1. Update type definitions in `src/lib/types.ts`
2. Modify storage functions in `src/lib/storage-simple.ts`
3. Update relevant components and forms

### Email Templates
Customize email templates in `src/lib/email.ts`:
- Modify HTML structure
- Update styling and branding
- Add new template types

### Styling
- Modify `src/styles/globals.css` for global styles
- Use Tailwind CSS classes for component styling
- Custom color scheme defined in CSS variables
- Dark/light theme support built-in

### Database Integration
Replace the storage functions in `src/lib/storage-simple.ts` with your preferred database solution:
- PostgreSQL with Prisma
- MongoDB with Mongoose  
- Supabase
- Firebase

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Environment Variables
For production email services, set these environment variables:
```
SENDGRID_API_KEY=your_sendgrid_key
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=your_mailgun_domain
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### Other Platforms
- **Netlify**: Build command `npm run build`, publish directory `out`
- **AWS Amplify**: Connect GitHub repository
- **Docker**: Use provided Dockerfile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support and questions:
- Create an issue on GitHub
- Email: support@chabs.com
- Documentation: [docs.chabs.com](https://docs.chabs.com)

## 🗺️ Roadmap

### Upcoming Features
- [ ] Multi-location inventory
- [ ] Barcode scanning
- [ ] Mobile app (React Native)
- [ ] Advanced reporting dashboard
- [ ] Integration with accounting software
- [ ] Multi-currency support
- [ ] Advanced user permissions
- [ ] API for third-party integrations
- [ ] Webhook support for email events
- [ ] Advanced email analytics

### Version History
- **v2.0.0**: 📧 Email integration, external suppliers, enhanced warehouse, modern themes
- **v1.3.0**: Multi-user support and role-based access
- **v1.2.0**: Enhanced UI/UX and mobile responsiveness
- **v1.1.0**: Added business insights and automation
- **v1.0.0**: Initial release with core functionality

## 🎯 What's New in v2.0.0

### Email System
- Professional HTML email templates
- Multi-provider support (SMTP, SendGrid, Mailgun)
- Email configuration UI
- Test email functionality
- Email tracking and history

### External Suppliers
- Dedicated external supplier management
- Processing service tracking
- Cost and lead time management
- Supplier rating system
- BOM integration

### Warehouse Enhancements
- Location-based inventory management
- Advanced stock movement tracking
- Order picking lists
- Enhanced alerts and notifications
- Capacity management

### Theme System
- Beautiful dark/light/auto themes
- Purple and pink gradient design
- Improved accessibility
- Persistent user preferences
- Mobile-optimized interface

### UI/UX Improvements
- Enhanced navigation with new sections
- Improved dashboard with real-time alerts
- Better mobile responsiveness
- Consistent design language
- Loading states and error handling

---

**CHABS Inventory Management System** - Empowering businesses with comprehensive inventory and business management solutions. 🚀