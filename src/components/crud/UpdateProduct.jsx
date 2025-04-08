import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';

import ProductForm from './ProductForm';
import { getProductById, updateProduct } from '../../services/api';
import { UI } from '../../utils/constants';

/**
 * Component for updating an existing product
 * 
 * @component
 */
const UpdateProduct = ({ productId, onSuccess, onCancel }) => {
  // Product data state
  const [product, setProduct] = useState(null);
  
  // Loading states
  const [isFetching, setIsFetching] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Error states
  const [fetchError, setFetchError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  
  // Reference to the Toast component for showing notifications
  const toast = useRef(null);

  /**
   * Fetch product data when component mounts or productId changes
   */
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setFetchError('Product ID is required');
        setIsFetching(false);
        return;
      }
      
      setIsFetching(true);
      setFetchError(null);
      
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (err) {
        console.error(`Error fetching product with ID ${productId}:`, err);
        setFetchError(
          err.message || `Failed to fetch product with ID ${productId}`
        );
        
        // Show error toast
        toast.current.show({
          severity: UI.SEVERITY.ERROR,
          summary: 'Failed to Load Product',
          detail: err.message || 'Could not load product details. Please try again.',
          life: UI.NOTIFICATION_TIMEOUT,
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [productId]);

  /**
   * Handles the form submission to update the product
   * 
   * @param {Object} productData - The updated product data
   */
  const handleSubmit = async (productData) => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      // Call the API to update the product
      const updatedProduct = await updateProduct(productId, productData);
      
      // Show success message
      toast.current.show({
        severity: UI.SEVERITY.SUCCESS,
        summary: 'Product Updated',
        detail: `Successfully updated product: ${updatedProduct.name}`,
        life: UI.NOTIFICATION_TIMEOUT,
      });
      
      // Call the success callback with the updated product
      if (onSuccess) {
        onSuccess(updatedProduct);
      }
    } catch (err) {
      // Handle API error
      console.error(`Error updating product with ID ${productId}:`, err);
      
      // Set error message
      setUpdateError(
        err.message || 'An error occurred while updating the product. Please try again.'
      );
      
      // Show error toast
      toast.current.show({
        severity: UI.SEVERITY.ERROR,
        summary: 'Update Failed',
        detail: err.message || 'Failed to update product. Please try again.',
        life: UI.NOTIFICATION_TIMEOUT,
      });
    } finally {
      setIsUpdating(false);
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

  // Show loading spinner while fetching product data
  if (isFetching) {
    return (
      <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '300px' }}>
        <ProgressSpinner />
        <p className="ml-2">Loading product data...</p>
      </div>
    );
  }

  // Show error message if fetch failed
  if (fetchError) {
    return (
      <div className="p-message p-message-error p-mb-3">
        <div className="p-message-text">{fetchError}</div>
      </div>
    );
  }

  return (
    <div className="update-product">
      <Toast ref={toast} />
      
      <Card title={`Edit Product: ${product?.name || ''}`} className="mb-3">
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isUpdating}
          error={updateError}
          submitLabel="Update Product"
        />
      </Card>
    </div>
  );
};

UpdateProduct.propTypes = {
  /** ID of the product to edit */
  productId: PropTypes.string.isRequired,
  
  /** Function called after successful product update */
  onSuccess: PropTypes.func,
  
  /** Function called when update is canceled */
  onCancel: PropTypes.func,
};

export default UpdateProduct;

