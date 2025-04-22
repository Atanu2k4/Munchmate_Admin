# MunchMate Admin Dashboard

A modern admin dashboard for managing restaurant orders, menu items, and QR code scanning functionality. Built with React, Vite, and Firebase.

## Features

- 🍽️ **Menu Management**

  - Add, edit, and delete menu items
  - Toggle item availability
  - Image upload with Cloudinary integration
  - Real-time updates

- 📋 **Order Management**

  - View and track orders in real-time
  - Filter orders by status and date
  - Search functionality
  - Detailed invoice view
  - Mark orders as delivered

- 📱 **QR Code Scanning**
  - Scan order QR codes
  - Quick order verification
  - Update delivery status

## Tech Stack

- **Frontend:** React.js with Vite
- **UI Framework:** TailwindCSS
- **State Management:** React Hooks
- **Backend:** Firebase (Firestore)
- **Image Storage:** Cloudinary
- **Animations:** Framer Motion
- **Icons:** React Icons (Feather)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Cloudinary account

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/munchmate-admin.git
cd munchmate-admin
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Project Structure

```
munchmate-admin/
├── src/
│   ├── components/         # React components
│   ├── assets/            # Static assets
│   ├── config.js          # Firebase configuration
│   ├── App.jsx            # Main app component
│   └── main.jsx          # Entry point
├── public/               # Public assets
└── vite.config.js       # Vite configuration
```

## Key Components

- `AdminMenu.jsx`: Menu item management interface
- `AdminOrders.jsx`: Order tracking and management
- `AdminScanQR.jsx`: QR code scanning functionality
- `OrderInvoiceDetail.jsx`: Detailed order/invoice view

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Icons for the beautiful icon set
- TailwindCSS for the utility-first CSS framework
- Firebase for the backend services
- Cloudinary for image management
