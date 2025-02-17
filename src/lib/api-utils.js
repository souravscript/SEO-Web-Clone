// Centralized API Utility for Consistent Fetch Configurations

/**
 * Custom error class for API-related errors
 */
export class APIError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Centralized fetch configuration with improved error handling and security
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options
 * @param {boolean} [includeCredentials=true] - Whether to include credentials
 * @returns {Promise} Parsed JSON response
 */
export async function apiRequest(url, options = {}, includeCredentials = true) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      // Consider adding CSRF protection headers
      // 'X-CSRF-Token': getCsrfToken()
    },
    credentials: includeCredentials ? 'include' : 'omit',
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new APIError(
        `HTTP error! status: ${response.status}`, 
        response.status, 
        { body: errorBody }
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    
    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError('Network or parsing error', 500, { originalError: error });
  }
}

/**
 * Wrapper for GET requests
 * @param {string} url - The API endpoint URL
 * @param {Object} [options={}] - Additional fetch options
 */
export const get = (url, options = {}) => 
  apiRequest(url, { method: 'GET', ...options });

/**
 * Wrapper for POST requests
 * @param {string} url - The API endpoint URL
 * @param {Object} body - Request body
 * @param {Object} [options={}] - Additional fetch options
 */
export const post = (url, body, options = {}) => 
  apiRequest(url, { 
    method: 'POST', 
    body: JSON.stringify(body), 
    ...options 
  });

// Add similar wrappers for PUT, DELETE, etc.

/**
 * Error handling utility for user-facing error messages
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export function getUserErrorMessage(error) {
  if (error instanceof APIError) {
    switch (error.status) {
      case 400: return 'Invalid request. Please check your input.';
      case 401: return 'Authentication required. Please log in.';
      case 403: return 'You do not have permission to perform this action.';
      case 404: return 'The requested resource was not found.';
      case 500: return 'An unexpected server error occurred. Please try again later.';
      default: return error.message || 'An unknown error occurred.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
