import { toast } from 'react-hot-toast';

// Improved error handling helper function
export const handleApiError = (error: any, defaultMessage: string): void => {
  console.error(defaultMessage, error);
  
  // Check if it's an API error with a response
  if (error?.response?.data?.message) {
    toast.error(error.response.data.message);
  } else if (error?.message) {
    toast.error(error.message);
  } else {
    toast.error(defaultMessage);
  }
};
