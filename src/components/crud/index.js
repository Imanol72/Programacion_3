/**
 * CRUD Components for Product Management
 * 
 * This file serves as a centralized export point for all CRUD-related components.
 * It allows importing either individual components or the entire set.
 * 
 * Example usage:
 * 
 * // Import all components
 * import CrudComponents from '../../components/crud';
 * <CrudComponents.CreateProduct />
 * 
 * // Import individual components
 * import { CreateProduct, UpdateProduct } from '../../components/crud';
 * <CreateProduct />
 */

// Import all CRUD components
import ProductForm from './ProductForm';
import CreateProduct from './CreateProduct';
import UpdateProduct from './UpdateProduct';
import DeleteProduct from './DeleteProduct';

// Export each component individually for named imports
export { ProductForm, CreateProduct, UpdateProduct, DeleteProduct };

// Export a default object with all components for convenience
export default {
  ProductForm,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
};

