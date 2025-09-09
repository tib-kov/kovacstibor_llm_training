# Market App - Product Management Frontend

A modern Angular Single-Page Application for managing products, built with Angular Material Design.

## Features

- **Product List**: View all products in a responsive grid layout
- **Product Details**: View detailed information about individual products
- **Create Product**: Add new products with form validation
- **Update Product**: Edit existing product information
- **Delete Product**: Remove products with confirmation dialog
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Material Design**: Beautiful UI with Angular Material components

## Technology Stack

- **Frontend Framework**: Angular 20
- **UI Library**: Angular Material
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Angular Reactive Forms
- **Styling**: SCSS with Material Design theme

## API Integration

The application integrates with a FastAPI backend running on `http://localhost:8000` with the following endpoints:

- `GET /products/` - List all products
- `GET /products/{id}` - Get product details
- `POST /products/` - Create a new product
- `PUT /products/{id}` - Update a product
- `DELETE /products/{id}` - Delete a product

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- FastAPI backend running on port 8000

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── product-list/          # Product listing component
│   │   ├── product-detail/        # Product detail view
│   │   ├── product-form/          # Create/edit product form
│   │   └── confirm-dialog/        # Confirmation dialog
│   ├── models/
│   │   └── product.model.ts       # Product interface definitions
│   ├── services/
│   │   └── product.service.ts     # HTTP API service
│   ├── app.component.ts           # Root component
│   ├── app.config.ts              # App configuration
│   └── app.routes.ts              # Route definitions
├── styles.scss                    # Global styles
└── index.html                     # Main HTML file
```

## Key Features

### Product Management
- Create, read, update, and delete products
- Form validation for all product fields
- Stock level indicators (low stock warnings)
- Price formatting with currency display

### User Experience
- Responsive grid layout for product cards
- Loading states and error handling
- Success/error notifications
- Confirmation dialogs for destructive actions
- Intuitive navigation with breadcrumbs

### Design
- Material Design principles
- Consistent color scheme (Indigo/Pink theme)
- Smooth animations and transitions
- Mobile-first responsive design
- Accessibility-compliant components

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Run linting
- `npm run e2e` - Run end-to-end tests

## Environment Configuration

The application is configured to connect to the FastAPI backend at `http://localhost:8000`. To change this, update the `apiUrl` in `src/app/services/product.service.ts`.
