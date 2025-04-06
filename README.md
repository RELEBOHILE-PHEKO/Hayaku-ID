# Hayaku-ID Frontend

## Overview

Hayaku-ID is a passport and ID application platform for the Kingdom of Lesotho built with React. The platform provides a comprehensive solution for ID verification, document processing, and user management with secure biometric authentication.

## Features

- **User Authentication**: Secure login and user profile management
- **Biometric Verification**: Advanced biometric authentication for identity confirmation
- **Document Verification**: Upload and verify identification documents
- **Application Management**: Track and manage ID/passport applications
- **Admin Dashboard**: Complete administrative control for managing applications, users, and system settings
- **Support System**: In-app ticket creation and management
- **Help Center & FAQ**: Resources to assist users with common questions

## Project Structure

```
Hayaku-ID/
├── frontend/                # Frontend React application
│   ├── node_modules/        # Dependencies
│   ├── public/              # Static assets
│   └── src/                 # Source code
│       ├── Components/      # Reusable UI components
│       │   ├── Biometrics/  # Biometric capture and verification components
│       │   ├── Payments/    # Payment processing components
│       │   └── Navbar.jsx   # Navigation component
│       ├── Pages/           # Application pages
│       │   ├── Admin/       # Admin portal pages
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── ApplicationReview.jsx
│       │   │   ├── DocumentVerification.jsx
│       │   │   ├── SystemSettings.jsx
│       │   │   └── UserManagement.jsx
│       │   └── Application/ # User application pages
│       │       ├── Dashboard.jsx
│       │       ├── FAQ.jsx
│       │       ├── Helpcenter.jsx
│       │       ├── LoginPage.jsx
│       │       ├── NotFound.jsx
│       │       ├── Profile.jsx
│       │       └── SupportTicket.jsx
│       ├── redux/           # State management
│       │   ├── store.js
│       │   └── userSlice.jsx
│       └── Services/        # API and service integration
│           ├── Api.js
│           ├── ApplicationService.js
│           ├── authService.js
│           ├── BiometricService.js
│           ├── DocumentService.js
│           └── paymentService.js
├── App.css                  # Global styles
├── App.js                   # Main application component
├── App.test.js              # Application tests
├── AppRoutes.js             # Application routing
├── index.css                # Index styles
├── index.js                 # Application entry point
├── logo.svg                 # Application logo
├── reportWebVitals.js       # Performance reporting
├── setupTests.js            # Test configuration
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── package.json             # Project dependencies and scripts
└── package-lock.json        # Lock file for dependencies
```

## Technology Stack

- **Frontend Framework**: React.js
- **State Management**: Redux
- **UI Components**: Bootstrap
- **Styling**: CSS
- **API Integration**: Axios
- **Authentication**: JWT
- **Testing**: Jest

## Getting Started


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://your-repository-url/Hayaku-ID.git
   cd Hayaku-ID/frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the frontend root directory
   - Add the necessary environment variables:
     ```
     REACT_APP_API_URL=http://localhost:8000/api
     REACT_APP_BIOMETRIC_SERVICE_URL=http://localhost:8001
     ```

### Running the Application

1. Start the development server
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This will create an optimized production build in the `build` folder.

## Application Flow

1. **User Registration/Login**:
   - New users register with basic information
   - Existing users log in via LoginPage.jsx

2. **Dashboard Access**:
   - After authentication, users land on Dashboard.jsx
   - Users can view application status and notifications

3. **Application Process**:
   - Users fill out application forms
   - Upload required documents for verification
   - Complete biometric capture if required
   - Make necessary payments
   - Submit application for review

4. **Admin Review**:
   - Admins review applications via AdminDashboard.jsx
   - Document verification via DocumentVerification.jsx
   - User management through UserManagement.jsx

5. **Support**:
   - Users can create support tickets via SupportTicket.jsx
   - Access help resources through Helpcenter.jsx and FAQ.jsx

## Component Details

### Core Components

- **Navbar.jsx**: Navigation component for the entire application
- **Biometrics/**: Components for capturing and processing biometric data
- **Payments/**: Components for handling payment transactions

### User Pages

- **Dashboard.jsx**: Main user interface showing application status
- **Profile.jsx**: User profile management
- **LoginPage.jsx**: User authentication
- **SupportTicket.jsx**: Support request submission

### Admin Pages

- **AdminDashboard.jsx**: Administrative overview
- **ApplicationReview.jsx**: Review and process applications
- **DocumentVerification.jsx**: Verify uploaded documents
- **UserManagement.jsx**: Manage user accounts
- **SystemSettings.jsx**: Configure system parameters

## API Services

The application interacts with backend services through dedicated service modules:

- **Api.js**: Base API configuration
- **ApplicationService.js**: Application processing
- **authService.js**: Authentication operations
- **BiometricService.js**: Biometric data handling
- **DocumentService.js**: Document processing
- **paymentService.js**: Payment processing

## State Management

Redux is used for state management with the following structure:

- **store.js**: Central Redux store configuration
- **userSlice.jsx**: User-related state management

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Verify API URL in `.env` file
   - Check if backend services are running

2. **Authentication Issues**:
   - Clear browser cookies and local storage
   - Verify credentials and token expiration

3. **Biometric Capture Problems**:
   - Ensure camera/fingerprint scanner permissions are granted
   - Check device compatibility

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature-name`
5. Submit a pull request

