# Product Management Frontend - Business Logic Documentation

An Angular SPA (Single Page Application) built with Tailwind CSS for managing products. This frontend application communicates with a FastAPI backend.

## Features

- **Product List**: View all products with pagination and filtering
- **Product Detail**: View detailed information about a specific product
- **Create Product**: Add new products to the system
- **Edit Product**: Update existing product information
- **Delete Product**: Remove products from the system
- **Responsive Design**: Mobile-first design using Tailwind CSS

## Technology Stack

- **Angular 20**: Frontend framework
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **Reactive Forms**: For form handling and validation
- **Angular Router**: For navigation and routing
- **HTTP Client**: For API communication

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header.component.ts          # Navigation header
│   │   ├── product-list.component.ts    # Product listing page
│   │   ├── product-detail.component.ts  # Product detail view
│   │   └── product-form.component.ts    # Create/Edit product form
│   ├── models/
│   │   └── product.model.ts             # Product interfaces and types
│   ├── services/
│   │   └── product.service.ts           # API service for product operations
│   ├── app.routes.ts                    # Route configuration
│   ├── app.config.ts                    # Application configuration
│   ├── app.ts                           # Root component
│   └── app.html                         # Root template
├── styles.scss                          # Global styles with Tailwind imports
└── index.html                          # Main HTML file
```

## Business Logic

### Product Model
- `id`: Unique identifier
- `name`: Product name (required)
- `price`: Product price (required, must be > 0)
- `description`: Optional product description
- `stock`: Stock quantity (required, must be >= 0)

### Components

#### Product List Component
- Displays all products in a responsive grid layout
- Shows product cards with name, price, description, and stock status
- Color-coded stock indicators (red: out of stock, yellow: low stock, green: in stock)
- Quick action buttons for view, edit, and delete
- Handles loading states and error messages

#### Product Detail Component
- Shows complete product information
- Provides edit and delete actions
- Responsive layout with proper typography
- Breadcrumb navigation back to product list

#### Product Form Component
- Handles both create and edit operations
- Form validation with real-time feedback
- Input validation for required fields and data types
- Error handling and loading states
- Cancel functionality with navigation

#### Product Service
- HTTP client wrapper for API communication
- Handles all CRUD operations (Create, Read, Update, Delete)
- Error handling and transformation
- Type-safe API responses

### Features Implemented

1. **Full CRUD Operations**
   - Create new products
   - Read/view products (list and detail)
   - Update existing products
   - Delete products with confirmation

2. **Form Validation**
   - Required field validation
   - Price validation (must be positive)
   - Stock validation (must be non-negative)
   - Real-time error display

3. **User Experience**
   - Loading indicators
   - Error messages
   - Confirmation dialogs for destructive actions
   - Responsive design for all screen sizes

4. **Navigation**
   - Route-based navigation
   - Header with consistent navigation
   - Breadcrumb navigation

## API Integration

The frontend communicates with a FastAPI backend running on `http://localhost:8000` with the following endpoints:

- `GET /products/` - Get all products
- `GET /products/{id}` - Get specific product
- `POST /products/` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

## Design System

The application uses Tailwind CSS with a consistent design system:

- **Colors**: Blue for primary actions, yellow for warnings, red for destructive actions, green for success
- **Typography**: Consistent heading sizes and text colors
- **Spacing**: Consistent padding and margins using Tailwind's spacing scale
- **Components**: Reusable button styles, form controls, and cards
- **Responsive**: Mobile-first design with responsive breakpoints

## Next Steps

This is the foundational business logic. You can now provide specific design requirements to customize:

1. **Visual Design**: Colors, typography, spacing
2. **Layout**: Grid systems, component layouts
3. **Interactions**: Animations, transitions, micro-interactions
4. **Additional Features**: Search, filtering, sorting, pagination
5. **Advanced UI**: Modals, tooltips, notifications
