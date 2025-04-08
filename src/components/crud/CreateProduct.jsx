import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';

import ProductForm from './ProductForm';
import { createProduct } from '../../services/api';
import { UI } from '../../utils/constants';

/**
 * Component for creating a new product
 * 
 * @component
 */
const CreateProduct = ({ onSuccess, onCancel }) => {
  // State for managing loading state during API calls
  const [isLoading, setIsLoading] = useState(false);
  
  // State for managing error messages
  const [error, setError] = useState(null);
  
  // Reference to the Toast component for showing notifications
  const toast = useRef(null);

  /**
   * Handles the form submission to create a new product
   * 
   * @param {Object} productData - The data for the new product
   */
  const handleSubmit = async (productData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the API to create the product
      const createdProduct = await createProduct(productData);
      
      // Show success message
      toast.current.show({
        severity: UI.SEVERITY.SUCCESS,
        summary: 'Product Created',
        detail: `Successfully created product: ${createdProduct.name}`,
        life: UI.NOTIFICATION_TIMEOUT,
      });
      
      // Call the success callback with the created product
      if (onSuccess) {
        onSuccess(createdProduct);
      }
    } catch (err) {
      // Handle API error
      console.error('Error creating product:', err);
      
      // Set error message
      setError(
        err.message || 'An error occurred while creating the product. Please try again.'
      );
      
      // Show error toast
      toast.current.show({
        severity: UI.SEVERITY.ERROR,
        summary: 'Creation Failed',
        detail: err.message || 'Failed to create product. Please try again.',
        life: UI.NOTIFICATION_TIMEOUT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="create-product">
      <Toast ref={toast} />
      
      <Card title="Create New Product" className="mb-3">
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          error={error}
          submitLabel="Create Product"
        />
      </Card>
    </div>
  );
};

CreateProduct.propTypes = {
  /** Function called after successful product creation */
  onSuccess: PropTypes.func,
  
  /** Function called when creation is canceled */
  onCancel: PropTypes.func,
};

export default CreateProduct;

