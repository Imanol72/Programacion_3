import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';

import { getProductById, deleteProduct } from '../../services/api';
import { UI } from '../../utils/constants';

/**
 * Component for deleting a product with confirmation
 * 
 * @component
 */
const DeleteProduct = ({ 
  productId, 
  visible, 
  onHide, 
  onSuccess 
}) => {
  // Product data state
  const [product, setProduct] = useState(null);
  
  // Loading states
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Error states
  const [fetchError, setFetchError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  
  // Reference to the Toast component for showing notifications
  const toast = useRef(null);

  /**
   * Fetch product data when component becomes visible and productId is provided
   */
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !visible) {
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
          detail: err.message || 'Could not load product details for deletion.',
          life: UI.NOTIFICATION_TIMEOUT,
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [productId, visible]);

  /**
   * Handles the product deletion process
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // Call the API to delete the product
      await deleteProduct(productId);
      
      // Show success message
      toast.current.show({
        severity: UI.SEVERITY.SUCCESS,
        summary: 'Product Deleted',
        detail: `Successfully deleted product: ${product?.name}`,
        life: UI.NOTIFICATION_TIMEOUT,
      });
      
      // Close the dialog
      if (onHide) {
        onHide();
      }
      
      // Call the success callback
      if (onSuccess) {
        onSuccess(productId);
      }
    } catch (err) {
      // Handle API error
      console.error(`Error deleting product with ID ${productId}:`, err);
      
      // Set error message
      setDeleteError(
        err.message || 'An error occurred while deleting the product. Please try again.'
      );
      
      // Show error toast
      toast.current.show({
        severity: UI.SEVERITY.ERROR,
        summary: 'Deletion Failed',
        detail: err.message || 'Failed to delete product. Please try again.',
        life: UI.NOTIFICATION_TIMEOUT,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Get dialog content based on current state
   */
  const getDialogContent = () => {
    // Show loading spinner while fetching product data
    if (isFetching) {
      return (
        <div className="p-d-flex p-jc-center p-ai-center p-my-4">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
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

    // Show delete error if deletion failed
    if (deleteError) {
      return (
        <div className="p-message p-message-error p-mb-3">
          <div className="p-message-text">{deleteError}</div>
        </div>
      );
    }

    // Show product details and confirmation message
    return (
      <div>
        <p className="font-bold text-lg mb-3">
          Are you sure you want to delete this product?
        </p>
        
        {product && (
          <div className="product-details p-mb-3">
            <div className="p-mb-2">
              <span className="font-bold">Name: </span>
              <span>{product.name}</span>
            </div>
            
            {product.data?.category && (
              <div className="p-mb-2">
                <span className="font-bold">Category: </span>
                <span>{product.data.category}</span>
              </div>
            )}
            
            {product.data?.price !== undefined && (
              <div className="p-mb-2">
                <span className="font-bold">Price: </span>
                <span>${product.data.price.toFixed(2)}</span>
              </div>
            )}
            
            <div className="p-mb-2 text-red-500 font-italic">
              This action cannot be undone.
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Dialog footer with action buttons
   */
  const dialogFooter = (
    <div>
      <Button 
        label="Cancel" 
        icon="pi pi-times" 
        className="p-button-text" 
        onClick={onHide} 
        disabled={isDeleting} 
      />
      <Button 
        label="Delete" 
        icon="pi pi-trash" 
        className="p-button-danger" 
        onClick={handleDelete} 
        loading={isDeleting} 
        disabled={isFetching || !!fetchError} 
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      
      <Dialog
        header="Confirm Deletion"
        visible={visible}
        onHide={onHide}
        footer={dialogFooter}
        closable={!isDeleting}
        closeOnEscape={!isDeleting}
        dismissableMask={!isDeleting}
        className="delete-product-dialog"
        style={{ width: '450px' }}
      >
        {getDialogContent()}
      </Dialog>
    </>
  );
};

DeleteProduct.propTypes = {
  /** ID of the product to delete */
  productId: PropTypes.string,
  
  /** Whether the dialog is visible */
  visible: PropTypes.bool.isRequired,
  
  /** Function called when the dialog is closed */
  onHide: PropTypes.func.isRequired,
  
  /** Function called after successful product deletion */
  onSuccess: PropTypes.func,
};

export default DeleteProduct;

