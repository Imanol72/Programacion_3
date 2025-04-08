/**
 * API Configuration
 * Constants for interacting with the restful-api.dev API
 */

// Base API URL for all requests
export const API_BASE_URL = 'https://api.restful-api.dev';

// Specific API endpoints
export const API_ENDPOINTS = {
  // Endpoint for retrieving all products or creating a new one
  PRODUCTS: '/objects',
  
  // Endpoint for operations on a single product (append product ID to this path)
  // Example: `/objects/12345` for a product with ID 12345
  PRODUCT_BY_ID: '/objects/',
};

/**
 * localStorage Configuration
 * Keys used for storing data in the browser's localStorage
 */
export const STORAGE_KEYS = {
  // Key for storing the list of products
  PRODUCTS: 'crud_products',
  
  // Key for storing user preferences
  PREFERENCES: 'crud_preferences',
  
  // Key for storing the last edit state (useful for form recovery)
  EDIT_STATE: 'crud_edit_state',
};

/**
 * Form Configuration
 * Constants related to product form fields and validation
 */
export const PRODUCT_FORM = {
  // Initial/empty state for a product form
  INITIAL_STATE: {
    name: '',
    data: {
      color: '',
      category: '',
      price: 0,
      description: '',
    },
  },
  
  // Validation messages for form fields
  VALIDATION: {
    REQUIRED: 'This field is required',
    MIN_LENGTH: 'Must be at least 3 characters',
    POSITIVE_NUMBER: 'Must be a positive number',
  },
};

/**
 * UI Configuration
 * Constants for UI-related settings
 */
export const UI = {
  // Severity levels for notifications (using PrimeReact severity levels)
  SEVERITY: {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warn',
  },
  
  // Default timeout for notifications in milliseconds
  NOTIFICATION_TIMEOUT: 3000,
};

