import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { ColorPicker } from 'primereact/colorpicker';

import { PRODUCT_FORM, STORAGE_KEYS } from '../../utils/constants';
import useLocalStorage from '../../hooks/useLocalStorage';

/**
 * Reusable form component for creating and updating products
 * 
 * @component
 */
const ProductForm = ({
  product = null,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  submitLabel = 'Save',
}) => {
  // Use the localStorage hook to save form data in case the user navigates away
  const [savedFormData, setSavedFormData, removeSavedFormData] = useLocalStorage(
    STORAGE_KEYS.EDIT_STATE,
    null
  );

  // Initialize form state with either the product data, saved form data, or the initial state
  const [formData, setFormData] = useState(() => {
    if (product) {
      return {
        name: product.name || '',
        data: {
          color: product.data?.color || '',
          category: product.data?.category || '',
          price: product.data?.price || 0,
          description: product.data?.description || '',
        }
      };
    }
    
    return savedFormData || PRODUCT_FORM.INITIAL_STATE;
  });

  // Form validation state
  const [errors, setErrors] = useState({
    name: '',
    color: '',
    category: '',
    price: '',
    description: '',
  });

  // List of category options - could be moved to constants or fetched from an API
  const categoryOptions = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Home Goods', value: 'home' },
    { label: 'Other', value: 'other' },
  ];

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    setSavedFormData(formData);
  }, [formData, setSavedFormData]);

  // Clear saved form data when form is submitted or canceled
  const cleanupForm = () => {
    removeSavedFormData();
  };

  /**
   * Validate form fields
   * @returns {boolean} - Whether the form is valid
   */
  const validateForm = () => {
    const newErrors = {
      name: '',
      color: '',
      category: '',
      price: '',
      description: '',
    };
    
    let isValid = true;

    // Validate name (required, min length)
    if (!formData.name.trim()) {
      newErrors.name = PRODUCT_FORM.VALIDATION.REQUIRED;
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = PRODUCT_FORM.VALIDATION.MIN_LENGTH;
      isValid = false;
    }

    // Validate color (required)
    if (!formData.data.color) {
      newErrors.color = PRODUCT_FORM.VALIDATION.REQUIRED;
      isValid = false;
    }

    // Validate category (required)
    if (!formData.data.category) {
      newErrors.category = PRODUCT_FORM.VALIDATION.REQUIRED;
      isValid = false;
    }

    // Validate price (must be positive)
    if (formData.data.price <= 0) {
      newErrors.price = PRODUCT_FORM.VALIDATION.POSITIVE_NUMBER;
      isValid = false;
    }

    // Validate description (required, min length)
    if (!formData.data.description.trim()) {
      newErrors.description = PRODUCT_FORM.VALIDATION.REQUIRED;
      isValid = false;
    } else if (formData.data.description.trim().length < 10) {
      newErrors.description = 'Must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handle input changes for simple fields
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        data: {
          ...formData.data,
          [name]: value,
        },
      });
    }
  };

  /**
   * Handle color picker changes
   */
  const handleColorChange = (e) => {
    setFormData({
      ...formData,
      data: {
        ...formData.data,
        color: '#' + e.value,
      },
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      cleanupForm();
    }
  };

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    cleanupForm();
    onCancel();
  };

  return (
    <div className="product-form p-fluid">
      {error && (
        <div className="p-message p-message-error">
          <div className="p-message-text">{error}</div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="p-field mb-3">
          <label htmlFor="name" className="font-bold">
            Product Name*
          </label>
          <InputText
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={classNames({ 'p-invalid': errors.name })}
            disabled={isLoading}
          />
          {errors.name && <small className="p-error">{errors.name}</small>}
        </div>
        
        <div className="p-field mb-3">
          <label htmlFor="color" className="font-bold">
            Color*
          </label>
          <div className="p-inputgroup">
            <ColorPicker
              id="color"
              value={formData.data.color.replace('#', '')}
              onChange={handleColorChange}
              disabled={isLoading}
            />
            <InputText
              name="color"
              value={formData.data.color}
              onChange={handleInputChange}
              className={classNames({ 'p-invalid': errors.color })}
              disabled={isLoading}
            />
          </div>
          {errors.color && <small className="p-error">{errors.color}</small>}
        </div>
        
        <div className="p-field mb-3">
          <label htmlFor="category" className="font-bold">
            Category*
          </label>
          <Dropdown
            id="category"
            name="category"
            value={formData.data.category}
            options={categoryOptions}
            onChange={handleInputChange}
            className={classNames({ 'p-invalid': errors.category })}
            placeholder="Select a category"
            disabled={isLoading}
          />
          {errors.category && <small className="p-error">{errors.category}</small>}
        </div>
        
        <div className="p-field mb-3">
          <label htmlFor="price" className="font-bold">
            Price*
          </label>
          <InputNumber
            id="price"
            name="price"
            value={formData.data.price}
            onValueChange={(e) => setFormData({
              ...formData,
              data: { ...formData.data, price: e.value }
            })}
            mode="currency"
            currency="USD"
            locale="en-US"
            min={0}
            className={classNames({ 'p-invalid': errors.price })}
            disabled={isLoading}
          />
          {errors.price && <small className="p-error">{errors.price}</small>}
        </div>
        
        <div className="p-field mb-3">
          <label htmlFor="description" className="font-bold">
            Description*
          </label>
          <InputTextarea
            id="description"
            name="description"
            value={formData.data.description}
            onChange={handleInputChange}
            rows={5}
            className={classNames({ 'p-invalid': errors.description })}
            disabled={isLoading}
          />
          {errors.description && <small className="p-error">{errors.description}</small>}
        </div>
        
        <div className="p-d-flex p-jc-between p-mt-3">
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-text"
            onClick={handleCancel}
            disabled={isLoading}
            type="button"
          />
          <Button
            label={submitLabel}
            icon="pi pi-save"
            loading={isLoading}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

ProductForm.propTypes = {
  /** The product to edit, null for creating a new product */
  product: PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.shape({
      color: PropTypes.string,
      category: PropTypes.string,
      price: PropTypes.number,
      description: PropTypes.string,
    }),
  }),
  /** Function called when the form is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Function called when the user cancels */
  onCancel: PropTypes.func.isRequired,
  /** Whether the form is currently submitting */
  isLoading: PropTypes.bool,
  /** Error message to display */
  error: PropTypes.string,
  /** Label for the submit button */
  submitLabel: PropTypes.string,
};

export default ProductForm;

