import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

/**
 * Handles API response and error checking
 * 
 * @param {Response} response - The fetch API response object
 * @returns {Promise<any>} - The parsed JSON response
 * @throws {Error} - Custom error with status code and message
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Create a custom error with the status and error message
    const error = new Error(
      data.message || `API Error: ${response.status} ${response.statusText}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

/**
 * Creates the full URL for an API endpoint
 * 
 * @param {string} endpoint - The API endpoint path
 * @param {string} [id] - Optional ID to append to the endpoint
 * @returns {string} - The complete API URL
 */
const createUrl = (endpoint, id = '') => {
  return `${API_BASE_URL}${endpoint}${id}`;
};

/**
 * Get all products from the API
 * 
 * @returns {Promise<Array>} - Array of product objects
 */
export const getProducts = async () => {
  try {
    const response = await fetch(createUrl(API_ENDPOINTS.PRODUCTS));
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Get a single product by ID
 * 
 * @param {string} id - The product ID
 * @returns {Promise<Object>} - The product object
 */
export const getProductById = async (id) => {
  try {
    const response = await fetch(createUrl(API_ENDPOINTS.PRODUCT_BY_ID, id));
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new product
 * 
 * @param {Object} product - The product data to create
 * @param {string} product.name - The name of the product
 * @param {Object} product.data - The product details
 * @returns {Promise<Object>} - The created product object with ID
 */
export const createProduct = async (product) => {
  try {
    const response = await fetch(createUrl(API_ENDPOINTS.PRODUCTS), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 * 
 * @param {string} id - The ID of the product to update
 * @param {Object} productData - The updated product data
 * @returns {Promise<Object>} - The updated product object
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(createUrl(API_ENDPOINTS.PRODUCT_BY_ID, id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a product by ID
 * 
 * @param {string} id - The ID of the product to delete
 * @returns {Promise<Object>} - The response from the API
 */
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(createUrl(API_ENDPOINTS.PRODUCT_BY_ID, id), {
      method: 'DELETE',
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Helper function to search products by name (client-side filtering)
 * 
 * @param {Array} products - Array of products to search through
 * @param {string} searchTerm - Term to search for in product names
 * @returns {Array} - Filtered array of products
 */
export const searchProducts = (products, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return products;
  }
  
  const term = searchTerm.toLowerCase().trim();
  return products.filter(product => 
    product.name.toLowerCase().includes(term) || 
    (product.data?.description && product.data.description.toLowerCase().includes(term))
  );
};

// Default export with all API functions
export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};

