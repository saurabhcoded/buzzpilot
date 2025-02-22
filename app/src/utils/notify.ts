import { toast, ToastOptions } from "react-toastify";

// Type for custom toast message options
interface CustomToastOptions extends ToastOptions {
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  autoClose?: number;
  theme?: "light" | "dark" | "colored";
}

 const notify = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (message: string) => {
    toast.error(message);
  },

  info: (message: string) => {
    toast.info(message);
  },

  warn: (message: string) => {
    toast.warn(message);
  },
  custom: (message: string, options: CustomToastOptions = {}) => {
    toast(message, {
      position: options.position || "top-right",
      autoClose: options.autoClose || 3000,
      hideProgressBar: options.hideProgressBar !== undefined ? options.hideProgressBar : false,
      closeOnClick: options.closeOnClick !== undefined ? options.closeOnClick : true, 
      pauseOnHover: options.pauseOnHover !== undefined ? options.pauseOnHover : true,
      draggable: options.draggable !== undefined ? options.draggable : true,
      theme: options.theme || "colored"
    });
  }
};

export default notify;