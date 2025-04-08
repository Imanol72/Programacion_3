import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * 
 * @param {string} key - The localStorage key to manage
 * @param {any} initialValue - The initial value if the key doesn't exist in localStorage
 * @returns {Array} - [storedValue, setValue, removeValue]
 *                    storedValue: The current value from localStorage
 *                    setValue: Function to update the value in localStorage and state
 *                    removeValue: Function to remove the value from localStorage
 */
const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  /**
   * Function to update value in localStorage and state
   * 
   * @param {any|Function} value - New value or function that receives previous value and returns new value
   */
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  /**
   * Function to remove the value from localStorage and reset state to initialValue
   */
  const removeValue = () => {
    try {
      // Remove from local storage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      
      // Reset state to initialValue
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  /**
   * Listen for changes to this localStorage key in other tabs/windows
   */
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          // If the key was removed
          if (event.newValue === null) {
            setStoredValue(initialValue);
            return;
          }
          
          // Otherwise, update the state with the new value
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.error(`Error handling storage event for key "${key}":`, error);
        }
      }
    };

    // Listen for storage events
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;

