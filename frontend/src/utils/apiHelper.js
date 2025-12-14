// API Helper - Wrapper functions để xử lý API calls với thông báo thân thiện
import { handleError, handleSuccess } from './messageHandler';

/**
 * Wrapper cho API calls với xử lý lỗi tự động
 * @param {Function} apiCall - Async function gọi API
 * @param {Object} options - Options
 * @param {Function} options.onSuccess - Callback khi thành công
 * @param {Function} options.onError - Callback khi có lỗi
 * @param {string} options.successMessage - Thông báo thành công tùy chỉnh
 * @param {boolean} options.showSuccessNotification - Hiển thị thông báo thành công (default: true)
 * @returns {Object} { success, data, error }
 */
export const apiWrapper = async (apiCall, options = {}) => {
  const {
    onSuccess,
    onError,
    successMessage,
    showSuccessNotification = false
  } = options;

  try {
    const response = await apiCall();
    const data = response?.data || response;
    
    // Xử lý thông báo thành công
    let message = null;
    if (showSuccessNotification) {
      message = successMessage || handleSuccess(data.message);
    }
    
    // Gọi callback nếu có
    if (onSuccess) {
      onSuccess(data, message);
    }
    
    return {
      success: true,
      data: data,
      message: message
    };
  } catch (error) {
    // Xử lý lỗi
    const errorMessage = error.friendlyMessage || handleError(error);
    
    // Gọi callback nếu có
    if (onError) {
      onError(errorMessage);
    }
    
    return {
      success: false,
      error: errorMessage,
      data: null
    };
  }
};

/**
 * Helper để xử lý API call với loading state và notification
 * @param {Function} apiCall - Async function gọi API
 * @param {Function} setLoading - setState function cho loading
 * @param {Function} showSuccess - Notification success function
 * @param {Function} showError - Notification error function
 * @param {Object} options - Options
 */
export const handleApiCall = async (
  apiCall,
  setLoading,
  showSuccess,
  showError,
  options = {}
) => {
  const {
    successMessage,
    onSuccess,
    onError,
    showSuccessNotification = true
  } = options;

  setLoading(true);
  
  try {
    const response = await apiCall();
    const data = response?.data || response;
    
    // Hiển thị thông báo thành công
    if (showSuccessNotification) {
      const message = successMessage || handleSuccess(data.message) || 'Thao tác thành công!';
      showSuccess(message);
    }
    
    // Gọi callback nếu có
    if (onSuccess) {
      onSuccess(data);
    }
    
    return { success: true, data };
  } catch (error) {
    // Xử lý và hiển thị lỗi
    const errorMessage = error.friendlyMessage || error.message || handleError(error);
    showError(errorMessage);
    
    // Gọi callback nếu có
    if (onError) {
      onError(errorMessage);
    }
    
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

/**
 * Helper để xử lý fetch data từ API
 */
export const fetchData = async (
  apiCall,
  setData,
  setLoading,
  showError,
  options = {}
) => {
  const { onError } = options;
  
  setLoading(true);
  
  try {
    const response = await apiCall();
    const data = response?.data || response;
    
    if (data.success && data.data) {
      setData(data.data);
      return { success: true, data: data.data };
    } else if (Array.isArray(data)) {
      setData(data);
      return { success: true, data };
    } else {
      setData(data);
      return { success: true, data };
    }
  } catch (error) {
    const errorMessage = error.friendlyMessage || error.message || handleError(error);
    showError(errorMessage);
    
    if (onError) {
      onError(errorMessage);
    }
    
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

/**
 * Helper để xử lý submit form
 */
export const handleFormSubmit = async (
  apiCall,
  formData,
  setLoading,
  setError,
  showSuccess,
  showError,
  options = {}
) => {
  const {
    successMessage,
    onSuccess,
    onValidate,
    resetForm
  } = options;

  // Validate nếu có
  if (onValidate) {
    const validationError = onValidate(formData);
    if (validationError) {
      setError(validationError);
      showError(validationError);
      return { success: false, error: validationError };
    }
  }

  setError('');
  setLoading(true);

  try {
    const response = await apiCall(formData);
    const data = response?.data || response;
    
    // Hiển thị thông báo thành công
    const message = successMessage || handleSuccess(data.message) || 'Thao tác thành công!';
    showSuccess(message);
    
    // Reset form nếu cần
    if (resetForm) {
      resetForm();
    }
    
    // Gọi callback nếu có
    if (onSuccess) {
      onSuccess(data);
    }
    
    return { success: true, data };
  } catch (error) {
    const errorMessage = error.friendlyMessage || error.message || handleError(error);
    setError(errorMessage);
    showError(errorMessage);
    
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

export default {
  apiWrapper,
  handleApiCall,
  fetchData,
  handleFormSubmit
};
